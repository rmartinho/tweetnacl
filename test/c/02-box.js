import nacl from './../../nacl-fast-es.js';
import util from './../helpers/nacl-util.js';
import {spawn} from 'child_process';
import path from 'path';
import test from './../helpers/teston.js';

function cbox(msg, sk, pk, n, callback) {
  var hexsk = (new Buffer(sk)).toString('hex');
  var hexpk = (new Buffer(pk)).toString('hex');
  var hexn = (new Buffer(n)).toString('hex');
  var p = spawn(path.resolve(__dirname, 'cbox'), [hexsk, hexpk, hexn]);
  var result = [];
  p.stdout.on('data', function(data) {
    result.push(data);
  });
  p.on('close', function(code) {
    return callback(Buffer.concat(result).toString('base64'));
  });
  p.on('error', function(err) {
    throw err;
  });
  p.stdin.write(msg);
  p.stdin.end();
}

test('nacl.box (C)', function(t) {
  var k1 = nacl.box.keyPair();

  function check(num, maxNum, next) {
    var sk2 = nacl.randomBytes(nacl.box.secretKeyLength);
    var msg = nacl.randomBytes(num);
    var nonce = nacl.randomBytes(24);
    var box = util.encodeBase64(nacl.box(msg, nonce, k1.publicKey, sk2));
    cbox(new Buffer(msg), sk2, k1.publicKey, nonce, function(boxFromC) {
      t.equal(box, boxFromC, 'boxes should be equal');
      t.ok(nacl.box.open(util.decodeBase64(boxFromC), nonce, k1.publicKey, sk2),
                'opening box should succeed');
      if (num >= maxNum) {
        if (next) next();
        return;
      }
      check(num+1, maxNum, next);
    });
  }
  
  t.timeout = 120000;
  t.plan(2218);
  check(0, 1024, function() {
    check(16417, 16500, function() {});
  });
});
