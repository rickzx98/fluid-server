import "babel-polyfill";

import FluidFunc from "fluid-func";
import { GET_ACTION } from "../../src/fluid.info";
import chai from "chai";

require("../../src/");


const expect = chai.expect;

describe("Test Action Config", () => {
    it("should extract Action Model from request action", done => {
        FluidFunc.start(GET_ACTION, {
            action: "Context.actionName@0.0.1"
        }).then(({ action }) => {
            expect(action("context")).to.not.be.undefined;
            expect(action("context")).to.be.equal("Context");
            expect(action("name")).to.not.be.undefined;
            expect(action("name")).to.be.equal("actionName");
            expect(action("version")).to.not.be.undefined;
            expect(action("version")).to.be.equal("0.0.1");
            done();
        }).catch(error => {
            console.log(error);
        });
    });
    it("should extract Action Model.Context and Model.actionName only from request action", done => {
        FluidFunc.start(GET_ACTION, {
            action: "Context.actionName"
        }).then(({ action }) => {
            expect(action("context")).to.not.be.undefined;
            expect(action("context")).to.be.equal("Context");
            expect(action("name")).to.not.be.undefined;
            expect(action("name")).to.be.equal("actionName");
            expect(action("version")).to.be.undefined;
            done();
        }).catch(error => {
            console.log(error);
        });
    });
    it("should throw an error if Model.Context is not specified from request action", done => {
        FluidFunc.start(GET_ACTION, {
            action: "actionName"
        }).catch(({ error }) => {
            expect(error.message).to.be.not.undefined;
            expect(error.message).to.be.equal("Missing context in action. Action must be in {Context}.{actionName} format.");
            done();
        });
    });
});