require("./Config");

import { LOGGER_CONFIG, LOG_ERROR, LOG_INFO, LOG_WARN } from '../fluid.info';

export class LoggerConfig {
    constructor(config, server) {
        this.server = server;
        server.use(LOGGER_CONFIG, config);
    }
}