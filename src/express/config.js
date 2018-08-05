import {
    EXPRESS_SERVER_CONFIG,
    EXPRESS_SERVER_CONNECT_MULTIPARTY,
    EXPRESS_SERVER_EMIT_EVENT,
    EXPRESS_SERVER_HTTPS_LISTENER,
    EXPRESS_SERVER_HTTPS_PROXY_LISTENER,
    EXPRESS_SERVER_HTTP_LISTENER,
    EXPRESS_SERVER_HTTP_PROXY_LISTENER,
    EXPRESS_SERVER_SOCKET_IO_LISTENER
} from "../fluid.info";
import { FluidFunc, SocketIO, bodyParser, cookieParser, cors, express, fs, http, httpProxy, https, morgan, multipart } from "../imports";

const NODE_ENV = process.env.NODE_ENV || "development";
const app = express();
export const ExpressApp = app;
FluidFunc.create(EXPRESS_SERVER_CONFIG)
    .onStart(({
        express_domainApi,
        express_enable_cors,
        express_cors,
        express_static,
        node_env
    }) => {
        console.log("express_static", express_static());
        if (express_static) {
            app.use(express.static(express_static()));
        }
        app.use(morgan(node_env()));
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        //TODO: fix default with Boolean value
        if (express_enable_cors && express_enable_cors()) {
            app.use(cors(express_cors()));
        }
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.json({
            type: 'application/vnd.api+json'
        }));
        if (express_domainApi) {
            app.get('/api', (req, res) => {
                res.status(200).send(express_domainApi());
            });
        }
    })
    .spec("node_env", {
        default: NODE_ENV
    })
    .spec("express_static")
    .spec("express_domainApi")
    .spec("express_enable_cors", { default: false })
    .spec("express_cors", {
        default: {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204
        }
    });


FluidFunc.create(EXPRESS_SERVER_CONNECT_MULTIPARTY)
    .onStart(({ express_tempDir }) => {
        app.use(multipart({
            uploadDir: express_tempDir()
        }));
    })
    .spec("express_tempDir", {
        require: true
    });


FluidFunc.create(EXPRESS_SERVER_HTTP_LISTENER)
    .onStart(({ express_port, express_host }) => {
        http.createServer(app).listen(express_port(), express_host());
        console.log('HTTP is listening to ', express_host(), express_port());
    })
    .spec("express_port", {
        default: 1028
    })
    .spec("express_host", {
        default: "127.0.0.1"
    });


FluidFunc.create(EXPRESS_SERVER_HTTPS_LISTENER)
    .onStart(({
        express_https_port,
        express_https_host,
        express_privateKey_path,
        express_certificate_part,
        express_encoding
    }) => {
        const credentials = {
            key: fs.readFileSync(express_privateKey_path(), express_encoding()),
            cert: fs.readFileSync(express_certificate_part(), express_encoding())
        };
        https.createServer(credentials, app).listen(express_https_port(), express_https_host());
        console.log('HTTPS is listening to ', express_https_host(), express_https_port());
    })
    .spec("express_https_port", {
        default: 443
    })
    .spec("express_https_host", {
        default: "127.0.0.1"
    })
    .spec("express_privateKey_path", {
        require: true
    })
    .spec("express_certificate_part", {
        require: true
    })
    .spec("express_encoding", {
        default: "utf8"
    });

/**
 * For Load Balancing
 */
FluidFunc.create(EXPRESS_SERVER_HTTP_PROXY_LISTENER)
    .onStart(({ express_proxy_port, express_addresses }) => {
        const addresses = express_addresses();
        let currentAddress = 0;
        const proxy = httpProxy.createProxyServer({});
        http.createServer((req, res) => {
            proxy.web(req, res, { target: addresses[currentAddress] });
            currentAddress = (currentAddress + 1) % addresses.length;
        }).listen(express_proxy_port());
    })
    .spec("express_proxy_port", { default: 8080 })
    .spec("express_addresses", { default: [] });

/**
 * For Load Balancing
 */
FluidFunc.create(EXPRESS_SERVER_HTTPS_PROXY_LISTENER)
    .onStart(({
        express_addresses,
        express_https_proxy_port,
        express_privateKey_path,
        express_certificate_part,
        express_encoding
    }) => {
        const port = express_https_proxy_port();
        const addresses = express_addresses();
        const credentials = {
            key: fs.readFileSync(express_privateKey_path(), express_encoding()),
            cert: fs.readFileSync(express_certificate_part(), express_encoding())
        };
        https.createServer(credentials, (req, res) => {
            proxy.web(req, res, { target: addresses[currentAddress] });
            currentAddress = (currentAddress + 1) % addresses.length;
        }).listen(port);
    })
    .spec("express_https_proxy_port", {
        default: 443
    })
    .spec("express_addresses", {
        default: []
    })
    .spec("express_privateKey_path", {
        require: true
    })
    .spec("express_certificate_part", {
        require: true
    })
    .spec("express_encoding", {
        default: "utf8"
    });

FluidFunc.create(EXPRESS_SERVER_SOCKET_IO_LISTENER)
    .onStart(({
        express_port,
        express_host,
        express_socket_events
    }) => {
        const port = express_port();
        const host = express_host();
        const serverSocketEvents = express_socket_events();
        const server = http.createServer(app);
        const io = SocketIO(server);
        server.listen(port, host);
        console.log("HTTP Socket is listening to ", host, port);
        io.on("connection", (socket) => {
            FluidFunc.create(EXPRESS_SERVER_EMIT_EVENT)
                .onStart(({ event, data }) => {
                    socket.emit(event(), data());
                })
                .spec("event", {
                    require: true
                })
                .spec("data", {
                    default: {}
                });
            for (let field in serverSocketEvents) {
                if (serverSocketEvents.hasOwnProperty(field)) {
                    const chainName = serverSocketEvents[field];
                    console.log('Socket listening to event', field);
                    socket.on(field, (data) => {
                        FluidFunc.start(chainName, data)
                            .catch(error => {
                                console.error('Failed on socket event', field);
                                console.error(result);
                            })
                    });
                }
            }
        });
    })
    .spec("express_port", {
        default: 80
    })
    .spec("express_host", {
        default: "0.0.0.0"
    })
    .spec("express_socket_events", {
        default: {}
    });
