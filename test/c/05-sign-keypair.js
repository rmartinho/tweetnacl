import nacl from './../../nacl-fast-es.js';
import util from './../helpers/nacl-util.js'
import {spawn, execFile} from 'child_process';
import path from 'path';
import test from './../helpers/teston.js';

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

function csignkeypair(callback) {
    execFile(path.resolve(__dirname, 'csign-keypair'), [], function(err, stdout) {
        if (err) throw err;
        callback(stdout.toString('utf8'));
    });
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
                    return;
                }
                check(num+1);
            });
        });
    }
	
    t.timeout = 20000;
    t.plan(101);
    check(0);
});