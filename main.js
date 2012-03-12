var cluster = require('cluster');

var processes = ['one', 'two', 'three'];
var workers = {};

var forkWorker = function (process_id) {
	var worker = cluster.fork();
	worker.send({process: process_id});
	workers[worker.pid] = process_id;
}

if (cluster.isMaster) {
	for(var i in processes) {
		forkWorker(i);
	}

	cluster.on('death', function(worker) {
		console.dir(worker);
		
		var processId = workers[worker.pid];
		if(processId) {
			delete workers[worker.pid];
			// Here is where you could optionally check worker.exitCode to see if the 
			// worker was gracefully exited or not - for example you might not want
			// to fork another worker if the worker exited gracefully.
			// Note that throwing an error sets exitCode to 1.
			forkWorker(processId);
		} else {
			console.warn('Dead worker with unknown process:');
			console.dir(worker);
			console.warn('(allowing it to die)');
		}
	});
} else {
	process.on('message', function(msg) {
		if(msg && msg.process) {
			var myProcess = processes[msg.process];
			if(myProcess) {
				console.log('Here is where I would require("./' + myProcess + '").');
				if(Math.random() < 0.5) {
					console.log('I think I will exit - ' + myProcess + '.');
					// process.exit(0);
					throw "exiting " + myProcess;
				}
			} else {
				console.error('Nonsense process id in msg, exiting.');
				console.dir(msg);
				process.exit(1);
			}
		}
	});
}
