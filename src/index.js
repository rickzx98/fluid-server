require("./clients/");
require("./request/");
require("./database/");
require("./logger/");
require("./server/");
require("./cluster/");
require("./action/");
require("./express");

import * as _FluidInfo from "./fluid.info";

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

export const FluidInfo = _FluidInfo;

console.log(FluidInfo);