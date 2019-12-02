import nacl from './../nacl-fast-es.js';
import test from './teston.mjs';
import specVectors from './data/onetimeauth.spec';
import util from './nacl-util.mjs'

test('nacl.lowlevel.crypto_onetimeauth specified vectors', function (t) {
  t.plan(specVectors.length);
  var out = new Uint8Array(16);
  specVectors.forEach(function (v) {
    nacl.lowlevel.crypto_onetimeauth(out, 0, v.m, 0, v.m.length, v.k);
    t.equal(util.encodeBase64(out), util.encodeBase64(v.out));
  });
});
