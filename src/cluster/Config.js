import { FluidFunc, cluster, os } from "../imports";

import { CLUSTER_CONFIG } from '../fluid.info';

FluidFunc.create(CLUSTER_CONFIG).onStart(({ cluster_max_cpu }) => {
    if (cluster.isMaster) {
        const maxCpus = cluster_max_cpu();
        for (var i = 0; i < maxCpus; i += 1) {
            cluster.fork();
        }
        const messageHandler = (msg) => {
            if (msg.cmd && msg.cmd === 'notifyRequest') {
                numReqs += 1;
            }
        };
        for (const id in cluster.workers) {
            cluster.workers[id].on('message', messageHandler);
        }
        cluster.on('exit', (worker) => {
            console.log('Worker %d died :(', worker.id);
            cluster.fork();
        });
        throw new Error("(Ignore this for now) This is master thread. Chain should break.");
    }
    return {
        server_cluster: true
    };
}).spec("cluster_max_cpu", {
    default: os.cpus().length
});