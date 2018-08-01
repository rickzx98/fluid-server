require("./clients/");
require("./request/");
require("./database/");
require("./logger/");
require("./server/");
require("./cluster/");
require("./action/");
require("./express");

import {
    CLUSTER_CONFIG,
    EXPRESS_SERVER_CONFIG,
    EXPRESS_SERVER_CONNECT_MULTIPARTY,
    EXPRESS_SERVER_EMIT_EVENT,
    EXPRESS_SERVER_HTTPS_PROXY_LISTENER,
    EXPRESS_SERVER_HTTP_LISTENER,
    EXPRESS_SERVER_SOCKET_IO_LISTENER,
    LOGGER_CONFIG,
    LOG_ERROR,
    LOG_INFO,
    LOG_WARN,
    MONGO_CONFIG,
    SERVER_CONNECT
} from "./fluid.info";

import { FluidFunc } from "./imports";

export class FluidServer {
    constructor() {
        this.config = {};
        this.services = [];
    }
    use(service, config) {
        this.services.push(service);
        if (config) {
            this.config = Object.assign(this.config, config);
        }
        return this;
    }
    start() {
        return new Promise((resolve, reject) => {
            FluidFunc.start(this.services, this.config).then(result => {
                resolve({ result });
            }).catch(error => {
                reject(error);
            })
        });
    }
}


new FluidServer()
    .use(EXPRESS_SERVER_CONFIG)
    .use(EXPRESS_SERVER_SOCKET_IO_LISTENER)
    .start()
    .then(() => {
        console.log("Started");
    }).catch(error => {
        console.error(error);
    });