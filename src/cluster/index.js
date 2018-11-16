require("./Config");

import {
    CLUSTER_CONFIG
} from "../fluid.info";

export class ClusterConfig {
    constructor(config, server) {
        this.server = server;
        server.use(CLUSTER_CONFIG, config);
    }
}
