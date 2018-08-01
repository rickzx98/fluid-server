import { CREATE_CLIENT, FIND_CLIENT } from "../fluid.info";

import { Client } from "./Model";
import { FluidFunc } from "../imports";

FluidFunc.create(CREATE_CLIENT).onStart(({
    skip, remoteAddress, remotePort, domain, tcp
}) => {

    return new Promise((resolve, reject) => {
        if (skip()) {
            resolve();
        } else {
            Client.create({
                remoteAddress: remoteAddress(),
                remotePort: remotePort(),
                domain: domain(),
                tcp: tcp()
            }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        }
    });
})
    .spec("remoteAddress", { require: true })
    .spec("remotePort", { require: true })
    .spec("domain", { default: "" })
    .spec("tcp", { default: {} })
    .spec("skip");


FluidFunc.create(FIND_CLIENT).onStart(({ remoteAddress, remotePort }) => {
    return new Promise((resolve) => {
        Client.findOne({
            remoteAddress: remoteAddress(),
            remotePort: remotePort()
        }).exec((err, result) => {
            if (err) {
                resolve({
                    skip: false
                });
            } else {
                if (result) {
                    resolve({
                        client: result,
                        skip: true
                    });
                } else {
                    resolve({ skip: false });
                }
            }
        });
    });
})
    .spec("remoteAddress", { require: true })
    .spec("remotePort", { require: true });