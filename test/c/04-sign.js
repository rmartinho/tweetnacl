import nacl from './../../nacl-fast-es.js';
import util from './../helpers/nacl-util.js'
import {spawn} from 'child_process';
import path from 'path';
import test from 'tape';

function csign(sk, msg, callback) {
  var hexsk = (new Buffer(sk)).toString('hex');
  var p = spawn(path.resolve(__dirname, 'csign'), [hexsk]);
  var result = [];
  p.stdout.on('data', function(data) {
    result.push(data);
  });
  p.on('close', function(code) {
    callback(Buffer.concat(result).toString('base64'));
  });
  p.on('error', function(err) {
    throw err;
  });
  p.stdin.write(msg);
  p.stdin.end();
}

test('nacl.sign (C)', function(t) {
  function check(num) {
    var keys = nacl.sign.keyPair();
    var msg = nacl.randomBytes(num);
    var signedMsg = util.encodeBase64(nacl.sign(msg, keys.secretKey));
    csign(keys.secretKey, new Buffer(msg), function(signedFromC) {
      t.equal(signedMsg, signedFromC, 'signed messages should be equal');
      var openedMsg = nacl.sign.open(util.decodeBase64(signedFromC), keys.publicKey);
      t.notEqual(openedMsg, null, 'open should succeed');
      t.equal(util.encodeBase64(openedMsg), util.encodeBase64(msg),
            'messages should be equal');
      if (num >= 100) {
        t.end();
        return;
      }
      check(num+1);
    });
  }

  check(0);
});
