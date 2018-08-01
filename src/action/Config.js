import { CHECK_ACTIONS, FIND_ACTION, GET_ACTION } from "../fluid.info";

import { FluidFunc } from "../imports";

FluidFunc.create(GET_ACTION)
    .onStart(({ action }) => {
        const actionValue = action();
        let contextIndex = actionValue.indexOf(".");
        let versionIndex = actionValue.indexOf("@");
        let context, name, version;
        if (contextIndex > -1) {
            context = actionValue.substr(0, contextIndex);
        }
        else {
            throw new Error("Missing context in action. Action must be in {Context}.{actionName} format.");
        }
        if (versionIndex > -1) {
            version = actionValue.substr(versionIndex + 1);
        }
        if (contextIndex > -1 && versionIndex > -1) {
            let length = actionValue.length - (contextIndex + 7);
            name = actionValue.substr(contextIndex + 1, length);
        } else if (contextIndex > -1) {
            name = actionValue.substr(contextIndex + 1);
        } else if (versionIndex > -1) {
            name = actionValue.substr(0, versionIndex - 1);
        } else {
            name = actionValue;
        }
        return {
            action: { context, version, name }
        };
    })
    .spec("action", { require: true });
FluidFunc.create(FIND_ACTION)
    .onStart(() => { });

FluidFunc.create(CHECK_ACTIONS)
    .onStart(({
        action
    }, current, index) => {

    })
    .reduce("action")
    .spec("action", {
        require: true
    });