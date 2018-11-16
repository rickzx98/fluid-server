require("./Config");

import {MONGO_CONFIG, MONGO_CONNECT} from "../fluid.info";

export class MongoConfig {
    constructor(config, server) {
        this.server = server;
        server
        .use(MONGO_CONFIG, config)
        .use(MONGO_CONNECT);
    }
}