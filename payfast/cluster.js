var cluster = require('cluster');
var os = require('os');

const CPUS = os.cpus();

// A primeira coisa é verificar se é o master
// pois ele é o único que pode invocar o fork()
if (cluster.isMaster) {

    CPUS.forEach(function () {
        cluster.fork()
    });

    cluster.on("listening", worker => {
        console.log("cluster %d conectado", worker.process.pid);
    });

    cluster.on("disconnect", worker => {
        console.log("cluster %d desconectado", worker.process.pid);
    });

    cluster.on("exit", function (worker) {
        console.log("cluster %d perdido", worker.process.pid);
        cluster.fork();
    });

    // Se o cluster não for o master, ele deve somente executar o index.js
    // subindo o objeto do express e ficando no ar para receber requisições.
} else {
    require('./index.js');
}