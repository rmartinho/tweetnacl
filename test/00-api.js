import nacl from './../nacl-fast-es.js';
import test from './teston.mjs';
import {throws} from "./test-util.mjs";

var nonce = new Uint8Array(nacl.secretbox.nonceLength);
var key = new Uint8Array(nacl.secretbox.keyLength);
var msg = new Uint8Array(10);

var arr = [1,2,3];

test('input type check', function(t) {
  t.plan(40);
  throws(t, function() { nacl.secretbox(arr, nonce, key); }, TypeError);
  throws(t, function() { nacl.secretbox(msg, arr, key); }, TypeError);
  throws(t, function() { nacl.secretbox(msg, nonce, arr); }, TypeError);
  throws(t, function() { nacl.secretbox.open(arr, nonce, key); }, TypeError);
  throws(t, function() { nacl.secretbox.open(msg, arr, key); }, TypeError);
  throws(t, function() { nacl.secretbox.open(msg, nonce, arr); }, TypeError);

  throws(t, function() { nacl.scalarMult(arr, key); }, TypeError);
  throws(t, function() { nacl.scalarMult(key, arr); }, TypeError);

  throws(t, function() { nacl.scalarMult.base(arr); }, TypeError);

  throws(t, function() { nacl.box(arr, nonce, key, key); }, TypeError);
  throws(t, function() { nacl.box(msg, arr, key, key); }, TypeError);
  throws(t, function() { nacl.box(msg, nonce, arr, key); }, TypeError);
  throws(t, function() { nacl.box(msg, nonce, key, arr); }, TypeError);

  throws(t, function() { nacl.box.open(arr, nonce, key, key); }, TypeError);
  throws(t, function() { nacl.box.open(msg, arr, key, key); }, TypeError);
  throws(t, function() { nacl.box.open(msg, nonce, arr, key); }, TypeError);
  throws(t, function() { nacl.box.open(msg, nonce, key, arr); }, TypeError);

  throws(t, function() { nacl.box.before(arr, key); }, TypeError);
  throws(t, function() { nacl.box.before(key, arr); }, TypeError);

  throws(t, function() { nacl.box.after(arr, nonce, key); }, TypeError);
  throws(t, function() { nacl.box.after(msg, arr, key); }, TypeError);
  throws(t, function() { nacl.box.after(msg, nonce, arr); }, TypeError);

  throws(t, function() { nacl.box.open.after(arr, nonce, key); }, TypeError);
  throws(t, function() { nacl.box.open.after(msg, arr, key); }, TypeError);
  throws(t, function() { nacl.box.open.after(msg, nonce, arr); }, TypeError);

  throws(t, function() { nacl.box.keyPair.fromSecretKey(arr); }, TypeError);

  throws(t, function() { nacl.sign(arr, key); }, TypeError);
  throws(t, function() { nacl.sign(msg, arr); }, TypeError);

  throws(t, function() { nacl.sign.open(arr, key); }, TypeError);
  throws(t, function() { nacl.sign.open(msg, arr); }, TypeError);

  throws(t, function() { nacl.sign.detached(arr, key); }, TypeError);
  throws(t, function() { nacl.sign.detached(msg, arr); }, TypeError);

  throws(t, function() { nacl.sign.detached.verify(arr, key, key); }, TypeError);
  throws(t, function() { nacl.sign.detached.verify(msg, arr, key); }, TypeError);
  throws(t, function() { nacl.sign.detached.verify(msg, key, arr); }, TypeError);

  throws(t, function() { nacl.sign.keyPair.fromSecretKey(arr); }, TypeError);
  throws(t, function() { nacl.sign.keyPair.fromSeed(arr); }, TypeError);

  throws(t, function() { nacl.hash(arr); }, TypeError);

  throws(t, function() { nacl.verify(arr, msg); }, TypeError);
  throws(t, function() { nacl.verify(msg, arr); }, TypeError);
});

