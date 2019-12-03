import nacl from './../nacl-fast-es.js';
import test from './helpers/teston.mjs';
import specVectors from './data/hash.spec.js';
import util from './helpers/nacl-util.mjs';

test('nacl.hash length', function(t) {
  t.plan(2);
  t.equal(nacl.hash(new Uint8Array(0)).length, 64);
  t.equal(nacl.hash(new Uint8Array(100)).length, 64);
});

test('nacl.hash exceptions for bad types', function(t) {
  t.plan(2);
  t.throws(function() { nacl.hash('string'); }, TypeError);
  t.throws(function() { nacl.hash([1,2,3]); }, TypeError);
});

test('nacl.hash specified test vectors', function(t) {
  t.plan(specVectors.length);
  specVectors.forEach(function(vec) {
    var goodHash = new Uint8Array(vec[0]);
    var msg = new Uint8Array(vec[1]);
    var hash = nacl.hash(msg);
    t.equal(util.encodeBase64(hash), util.encodeBase64(goodHash));
  });
});
