import { ClusterConfig } from "./cluster";
import { ExpressConfig } from "./express";
import { FluidFunc } from "./imports";
import { LoggerConfig } from "./logger";
import { MongoConfig } from "./database";

export default class FluidServer {
    constructor() {
        this.config = {};
        this.services = [];
    }
    static createServer() {
        return new FluidServer();
    }
    static createLogger(loggerName) {
        return {
            info: (logInfo) => LoggerConfig.logInfo(logInfo, loggerName),
            error: (logError) => LoggerConfig.logError(logError, loggerName),
            warn: (logWarn) => LoggerConfig.logWarn(logWarn, loggerName)
        };
    }
    logger(config) {
        return new LoggerConfig(config, this).server;
    }
    cluster(config) {
        return new ClusterConfig(config, this).server;
    }
    mongodb(config) {
        return new MongoConfig(config, this).server;
    }
    express(config) {
        return new ExpressConfig(config, this);
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