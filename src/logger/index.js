require("./Config");

import { LOGGER_CONFIG, LOG_ERROR, LOG_INFO, LOG_WARN } from '../fluid.info';

import { FluidFunc } from "../imports";

export class LoggerConfig {
    constructor(config, server) {
        this.server = server;
        server.use(LOGGER_CONFIG, config);
    }
    static logInfo(logInfo, loggerName) {
        FluidFunc.start(LOG_INFO, {
            logInfo, loggerName
        });
    }
    static logError(logError, loggerName) {
        FluidFunc.start(LOG_ERROR, {
            logError, loggerName
        });
    }
    static logWarn(logWarn, loggerName) {
        FluidFunc.start(LOG_WARN, {
            logWarn, loggerName
        });
    }
}