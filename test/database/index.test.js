import "babel-polyfill";

import FluidFunc from "fluid-func";
import { MONGO_CONFIG } from "../../src/fluid.info";
import chai from "chai";

const expect = chai.expect;

describe("Test MongoDB Config", () => {
    it("should create mongo url with default values", done => {
        FluidFunc.start(MONGO_CONFIG)
            .then(({ mongo_url }) => {
                expect(mongo_url).to.be.not.undefined;
                expect(mongo_url()).to.be.equal("mongodb://127.0.0.1:27017/fsdb");
                done();
            })
            .catch(error => {
                console.log(error);
            });
    });
    it("should create mongo url with default username and password values", done => {
        FluidFunc.start(MONGO_CONFIG, {
            mongo_user: "user",
            mongo_password: "password"
        })
            .then(({ mongo_url }) => {
                expect(mongo_url).to.be.not.undefined;
                expect(mongo_url()).to.be.equal("mongodb://user:password@127.0.0.1:27017/fsdb");
                done();
            })
            .catch(error => {
                console.log(error);
            });
    });
});