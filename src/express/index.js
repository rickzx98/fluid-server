import {
    EXPRESS_SERVER_CONFIG,
    EXPRESS_SERVER_CONNECT_MULTIPARTY,
    EXPRESS_SERVER_HTTPS_LISTENER,
    EXPRESS_SERVER_HTTPS_PROXY_LISTENER,
    EXPRESS_SERVER_HTTP_LISTENER,
    EXPRESS_SERVER_HTTP_PROXY_LISTENER,
    EXPRESS_SERVER_SOCKET_IO_LISTENER
} from "../fluid.info";

export { ExpressApp } from "./config";

export class ExpressConfig {
    constructor(config, server) {
        this.server = server;
        server.use(EXPRESS_SERVER_CONFIG, config);
    }

    multiparty(config) {
        this.server.use(EXPRESS_SERVER_CONNECT_MULTIPARTY, config);
        return this;
    }

    http(config) {
        return this.server.use(EXPRESS_SERVER_HTTP_LISTENER, config);
    }

    https(config) {
        return this.server.use(EXPRESS_SERVER_HTTPS_LISTENER, config);
    }

    http_proxy(config) {
        return this.server.use(EXPRESS_SERVER_HTTP_PROXY_LISTENER, config);
    }

    https_proxy(config) {
        return this.server.use(EXPRESS_SERVER_HTTPS_PROXY_LISTENER, config);
    }

    socket_io(config) {
        return this.server.use(EXPRESS_SERVER_SOCKET_IO_LISTENER, config);
    }
}