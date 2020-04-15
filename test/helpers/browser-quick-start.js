import StaticServer from 'simplatic-http-server'
import open from 'open';
import fs from 'fs';

function hashString(text){
  return text
    .split("")
	.reduce(function(a,b){
		a=((a<<5)-a)+b.charCodeAt(0);
		return a&a
	},0);              
}

function createPortNumber(seed){
	const startPort = 49151;
	const endPort = 65535;
	return startPort + Math.abs(seed) % (endPort-startPort);
}

async function startServer(portNumber){
	const staticServer = new StaticServer(portNumber, process.cwd());
	await staticServer.listen();
	console.log('The static server listening on '+portNumber);
}

async function startBrowser(subPath, portNumber){
	await open('http://127.0.0.1:'+portNumber+subPath);
}

async function start(){
	if (process.argv.length !== 3){
		console.log("Need argument with path to start html file");
		return;
	}
	const subPath = process.argv[2];
	if (!fs.existsSync('.'+subPath)){
		console.log("No file ");
		return;
	}
	const seed = hashString(process.cwd()+subPath);
	const portNumber = createPortNumber(seed);
	await startServer(portNumber);
	await startBrowser(subPath, portNumber);
}

start();