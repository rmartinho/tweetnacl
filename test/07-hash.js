import nacl from './../nacl-fast-es.js';
import test from './teston.mjs';
import randomVectors from './data/hash.random.js';
import util from './nacl-util.mjs'

test('nacl.hash random test vectors', function(t) {
  t.plan(randomVectors.length);
  randomVectors.forEach(function(vec) {
    var msg = util.decodeBase64(vec[0]);
    var goodHash = util.decodeBase64(vec[1]);
    var hash = nacl.hash(msg);
    t.equal(util.encodeBase64(hash), util.encodeBase64(goodHash));
  });
});
