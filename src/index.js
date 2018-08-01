require("./clients/");
require("./request/");
require("./database/");
require("./logger/");
require("./server/");
require("./cluster/");
require("./action/");

// import { CLUSTER_CONFIG, MONGO_CONFIG, MONGO_CONNECT, SERVER_CONNECT } from "./fluid.info";

// import FluidFunc from "fluid-func";

// FluidFunc.create("hello")
//     .onStart(() => {
//         console.log("Hello world");
//     });

// FluidFunc.create("world")
//     .onStart(() => {
//         console.log("hello");
//     });

// FluidFunc.config({
//     logMonitor: function (monitor) {
//         //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>  Fluid LOG");
//         // console.log(monitor.source, monitor.message);
//         //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>  Fluid LOG END");
//     }
// });
// FluidFunc.start([CLUSTER_CONFIG, MONGO_CONFIG, MONGO_CONNECT, SERVER_CONNECT])
//     .then(() => {
//         console.log("Server started");
//     })
//     .catch(error => {
//         console.log(error);
//     });