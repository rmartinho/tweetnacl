import nacl from './../nacl-fast-es.js';
import test from './teston.mjs';
import randomVectors from './data/secretbox.random.js';
import util from './nacl-util.mjs'

test('nacl.secretbox random test vectors', function(t) {
  t.plan(randomVectors.length*4);
  randomVectors.forEach(function(vec) {
    var key = util.decodeBase64(vec[0]);
    var nonce = util.decodeBase64(vec[1]);
    var msg = util.decodeBase64(vec[2]);
    var goodBox = util.decodeBase64(vec[3]);
    var box = nacl.secretbox(msg, nonce, key);
    t.ok(box, 'box should be created');
    t.equal(util.encodeBase64(box), util.encodeBase64(goodBox));
    var openedBox = nacl.secretbox.open(goodBox, nonce, key);
    t.ok(openedBox, 'box should open');
    t.equal(util.encodeBase64(openedBox), util.encodeBase64(msg));
  });
});
