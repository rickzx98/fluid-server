import { FluidFunc, log4js } from "../imports";
import { LOGGER_CONFIG, LOG_ERROR, LOG_INFO, LOG_WARN } from '../fluid.info';

let loggerName;

export const Logger = (loggerName) => {
    return log4js.getLogger(loggerName);
}

FluidFunc.create(LOGGER_CONFIG)
    .onStart(param => {
        log4js.loadAppender('file');
        log4js.addAppender(log4js.appenders.file(param.logger_filePath()), param.logger_name());
        if (param.logger_level) {
            log4js.setLevel(param.logger_level());
        }
    })
    .spec("logger_filePath", { require: true })
    .spec("logger_name", { require: true })
    .spec("logger_level", { require: true });


FluidFunc.create(LOG_INFO)
    .onStart(({ logInfo, loggerName }) => {
        Logger(loggerName()).info(logInfo());
    })
    .spec("logInfo", { require: true })
    .spec("loggerName", { require: true });

FluidFunc.create(LOG_ERROR)
    .onStart(({ logError, loggerName }) => {
        Logger(loggerName()).error(logError());
    })
    .spec("logError", { require: true })
    .spec("loggerName", { require: true });


FluidFunc.create(LOG_WARN)
    .onStart(({ logWarn, loggerName }) => {
        Logger(loggerName()).warn(logWarn());
    })
    .spec("logWarn", { require: true })
    .spec("loggerName", { require: true });