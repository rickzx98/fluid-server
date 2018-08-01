import { CREATE_REQUEST } from "../fluid.info";
import { FluidFunc } from "../imports";
import { Request } from "./Model";

FluidFunc.create(CREATE_REQUEST).onStart(({
    data, action, clientId
}) => {
    return new Promise((resolve, reject) => {
        Request.create({
            clientId: clientId(),
            data: data(),
            action: action(),
            status: "PENDING"
        }).then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}).spec("client", {
    translate: (client, context) => new Promise((resolve) => {
        context.set("clientId", client._id);
        resolve();
    })
}).spec("clientId")
    .spec("action", { require: true })
    .spec("data", { default: {} });
