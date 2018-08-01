import { FluidFunc, mongoose } from "../imports";
import { MONGO_CONFIG, MONGO_CONNECT } from '../fluid.info';

FluidFunc.create(MONGO_CONFIG)
    .onStart(({ mongo_port, mongo_host, mongo_user, mongo_password, mongo_databaseName }) => {
        const port = mongo_port();
        const host = mongo_host();
        const databaseName = mongo_databaseName();
        const user = mongo_user ? mongo_user() : undefined;
        const password = mongo_password ? mongo_password() : undefined;
        let url = 'mongodb://';
        if (user && password) {
            url += user;
            url += ':' + password;
            url += '@';
        }
        url += host;
        url += ':';
        url += port;
        url += '/';
        url += databaseName;
        return {
            mongo_url: url
        };
    })
    .spec("mongo_port", {
        default: 27017
    })
    .spec("mongo_host", {
        default: "127.0.0.1"
    })
    .spec("mongo_databaseName", {
        default: "fsdb"
    });

FluidFunc.create(MONGO_CONNECT).onStart(param => {
    return new Promise((resolve, reject) => {
        MongoConnect(param, 0, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
})
    .spec("mongo_url", { require: true })
    .spec("mongo_retry", {
        default: 5
    });

const MongoConnect = (param, tries, done) => {
    if (!tries) {
        tries = 0;
    }
    if (tries < param.mongo_retry()) {
        mongoose.connect(param.mongo_url(), {
            useNewUrlParser: true
        }, err => {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                tries++;
                setTimeout(() => {
                    MongoConnect(param, tries);
                }, 5000);
            } else {
                done();
            }
        });
    } else {
        done(new Error('Failed to connect to mongo db'));
    }
}