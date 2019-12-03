import StaticServer from 'simplatic-http-server'
import open from 'open';

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
	const bob = (endPort-startPort)
	return startPort + Math.abs(seed) % (endPort-startPort);
}

async function startSerer(portNumber){
	const staticServer = new StaticServer(portNumber);
	await staticServer.listen();
	console.log('The static server listening on '+portNumber);
}

async function startBrowser(subPath, portNumber){
	await open('http://127.0.0.1:'+portNumber+subPath);
}

const subPath = '/test/browser/index.html';
const seed = hashString(process.cwd()+subPath);
const portNumber = createPortNumber(seed);
startSerer(portNumber);
startBrowser(subPath, portNumber);