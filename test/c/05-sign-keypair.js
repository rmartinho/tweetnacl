import nacl from './../../nacl-fast-es.js';
//import test from './../helpers/teston.js';
import util from './../helpers/nacl-util.js'
import {spawn, execFile} from 'child_process';
import path from 'path';
var test = require('tape');
import {c} from 'compile-run'

console.log(c)

console.log(spawn)
console.log(path.resolve(__dirname, 'csign'))

function csign(sk, msg, callback) {
  var hexsk = (new Buffer(sk)).toString('hex');
  console.log(hexsk)
  var p = spawn(path.resolve(__dirname, 'csign.c'), [hexsk]);
  console.log("svin")
  var result = [];
  p.stdout.on('data', function(data) {
    result.push(data);
  });
  p.on('close', function(code) {
    callback(Buffer.concat(result).toString('base64'));
  });
  p.on('error', function(err) {
    console.log("gris")
    throw err;
  });
  p.stdin.write(msg);
  p.stdin.end();
}

async function csignkeypair(callback) {
  let filePath = path.resolve(__dirname, 'csign-keypair.c')
  console.log("2" + filePath)

  let result = await c.runFile(filePath)
  console.log("3", result);
  callback(result)
}

test('nacl.sign (C) with keypair from C', function(t) {
  function check(num) {
    csignkeypair(function(hexSecretKey) {
      var secretKey = new Uint8Array(nacl.sign.secretKeyLength);
      var b = new Buffer(hexSecretKey, 'hex');
      for (var i = 0; i < b.length; i++) secretKey[i] = b[i];
      var msg = nacl.randomBytes(num);
      var signedMsg = util.encodeBase64(nacl.sign(msg, secretKey));
      csign(secretKey, new Buffer(msg), function(signedFromC) {
        t.equal(signedMsg, signedFromC, 'signed messages should be equal');
        if (num >= 100) {
          t.end();
          return;
        }
        check(num+1);
      });
    });
  }

  /*
  let filePath = path.resolve(__dirname, './../test-quick.js')
  console.log(filePath)
  execFile("node", ["-r", "esm", filePath], function(err, stdout) {
    console.log("broo")
    console.log(stdout)
    if (err) throw err;
  });*/

  check(0);
});
