import nacl from './../nacl-fast-es.js';
import test from './teston.mjs';
import util from './nacl-util.mjs'

test('nacl.box.keyPair', function(t) {
  t.plan(3);
  var keys = nacl.box.keyPair();
  t.ok(keys.secretKey && keys.secretKey.length === nacl.box.secretKeyLength, 'has secret key');
  t.ok(keys.publicKey && keys.publicKey.length === nacl.box.publicKeyLength, 'has public key');
  t.ok(util.encodeBase64(keys.secretKey) !== util.encodeBase64(keys.publicKey));
});

test('nacl.box.keyPair.fromSecretKey', function(t) {
  t.plan(2);
  var k1 = nacl.box.keyPair();
  var k2 = nacl.box.keyPair.fromSecretKey(k1.secretKey);
  t.equal(util.encodeBase64(k2.secretKey), util.encodeBase64(k1.secretKey));
  t.equal(util.encodeBase64(k2.publicKey), util.encodeBase64(k1.publicKey));
});

test('nacl.box and nacl.box.open', function(t) {
  t.plan(3);
  var clientKeys = nacl.box.keyPair();
  var serverKeys = nacl.box.keyPair();
  var nonce = new Uint8Array(nacl.box.nonceLength);
  for (var i = 0; i < nonce.length; i++) nonce[i] = (32+i) & 0xff;
  var msg = util.decodeUTF8('message to encrypt');
  var clientBox = nacl.box(msg, nonce, serverKeys.publicKey, clientKeys.secretKey);
  var clientMsg = nacl.box.open(clientBox, nonce, clientKeys.publicKey, serverKeys.secretKey);
  t.equal(util.encodeUTF8(clientMsg), util.encodeUTF8(msg));
  var serverBox = nacl.box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
  t.equal(util.encodeBase64(clientBox), util.encodeBase64(serverBox));
  var serverMsg = nacl.box.open(serverBox, nonce, serverKeys.publicKey, clientKeys.secretKey);
  t.equal(util.encodeUTF8(serverMsg), util.encodeUTF8(msg));
});

test('nacl.box.open with invalid box', function(t) {
  t.plan(3);
  var clientKeys = nacl.box.keyPair();
  var serverKeys = nacl.box.keyPair();
  var nonce = new Uint8Array(nacl.box.nonceLength);
  t.equal(nacl.box.open(new Uint8Array(0), nonce, serverKeys.publicKey, clientKeys.secretKey), null);
  t.equal(nacl.box.open(new Uint8Array(10), nonce, serverKeys.publicKey, clientKeys.secretKey), null);
  t.equal(nacl.box.open(new Uint8Array(100), nonce, serverKeys.publicKey, clientKeys.secretKey), null);
});

test('nacl.box.open with invalid nonce', function(t) {
  t.plan(2);
  var clientKeys = nacl.box.keyPair();
  var serverKeys = nacl.box.keyPair();
  var nonce = new Uint8Array(nacl.box.nonceLength);
  for (var i = 0; i < nonce.length; i++) nonce[i] = i & 0xff;
  var msg = util.decodeUTF8('message to encrypt');
  var box = nacl.box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
  t.equal(util.encodeUTF8(nacl.box.open(box, nonce, serverKeys.publicKey, clientKeys.secretKey)),
          util.encodeUTF8(msg));
  nonce[0] = 255;
  t.equal(nacl.box.open(box, nonce, serverKeys.publicKey, clientKeys.secretKey), null);
});

test('nacl.box.open with invalid keys', function(t) {
  t.plan(4);
  var clientKeys = nacl.box.keyPair();
  var serverKeys = nacl.box.keyPair();
  var nonce = new Uint8Array(nacl.box.nonceLength);
  var msg = util.decodeUTF8('message to encrypt');
  var box = nacl.box(msg, nonce, clientKeys.publicKey, serverKeys.secretKey);
  t.equal(util.encodeUTF8(nacl.box.open(box, nonce, serverKeys.publicKey, clientKeys.secretKey)),
          util.encodeUTF8(msg));
  t.equal(util.encodeUTF8(nacl.box.open(box, nonce, clientKeys.publicKey, serverKeys.secretKey)),
          util.encodeUTF8(msg));
  var badPublicKey = new Uint8Array(nacl.box.publicKeyLength);
  t.equal(nacl.box.open(box, nonce, badPublicKey, clientKeys.secretKey), null);
  var badSecretKey = new Uint8Array(nacl.box.secretKeyLength);
  t.equal(nacl.box.open(box, nonce, serverKeys.publicKey, badSecretKey), null);
});
