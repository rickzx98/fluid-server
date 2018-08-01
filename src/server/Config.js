import { CREATE_CLIENT, CREATE_REQUEST, FIND_CLIENT, GET_ACTION, SERVER_CONNECT, SERVER_RESPOND } from "../fluid.info";
import { FluidFunc, net } from "../imports";

FluidFunc.create(SERVER_CONNECT)
    .onStart(({ host, port }) => {
        const server = net.createServer(socket => {
            socket.on('data', bufferedData => {
                const { remoteAddress, remotePort, _server } = socket;
                const { action, data } = JSON.parse(bufferedData.toString("utf8"));
                const startParams = {
                    data, ...data, remoteAddress, remotePort,
                    domain: _server.domain, tcp: _server.tcp
                };
                const processActions = [FIND_CLIENT, CREATE_CLIENT, FIND_CLIENT, CREATE_REQUEST, GET_ACTION];
                if (action instanceof Array) {
                    let newActions = [...action];
                    newActions.unshift(GET_ACTION);
                    newActions.unshift(CREATE_REQUEST);
                    newActions.unshift(FIND_CLIENT);
                    newActions.unshift(CREATE_CLIENT);
                    newActions.unshift(FIND_CLIENT);
                    newActions.push(SERVER_RESPOND);
                    FluidFunc.start(newActions, {
                        action: JSON.stringify(action),
                        ...startParams
                    }).catch(error => {
                        console.log(error);
                        socket.write(JSON.stringify(error));
                    });
                } else {
                    processActions.push(action);
                    processActions.push(SERVER_RESPOND);
                    FluidFunc.start(processActions, {
                        action,
                        ...startParams
                    }).catch(error => {
                        console.log(error);
                        socket.write(JSON.stringify(error));
                    });
                }
            });
            FluidFunc.create(SERVER_RESPOND)
                .onStart(param => {
                    const paramKeys = Object.keys(param);
                    const result = {};
                    paramKeys.forEach(key => {
                        result[key] = param[key]();
                    })
                    socket.write(JSON.stringify(result));
                });
        });
        return new Promise((resolve, reject) => {
            try {
                server.listen(port(), host(), () => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    })
    .spec("host", {
        default: "127.0.0.1"
    })
    .spec("port", {
        default: 1337
    });