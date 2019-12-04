import nacl from './../../nacl-fast-es.js';
import {spawn} from 'child_process';
import path from 'path';
import test from 'tape';

function chash(msg, callback) {
  var p = spawn(path.resolve(__dirname, 'chash'));
  var result = [];
  p.stdout.on('data', function(data) {
    result.push(data);
  });
  p.on('close', function(code) {
    return callback(Buffer.concat(result).toString('utf8'));
  });
  p.on('error', function(err) {
    throw err;
  });
  p.stdin.write(msg);
  p.stdin.end();
}

test('nacl.hash (C)', function(t) {
  function check(num) {
    var msg = nacl.randomBytes(num);
    var h = nacl.hash(msg);
    var hexH = (new Buffer(h)).toString('hex');
    chash(new Buffer(msg), function(hexCH) {
      t.equal(hexH, hexCH, 'hashes should be equal');
      if (num >= 1000) {
        t.end();
        return;
      }
      check(num+1);
    });
  }

  check(0);
});
