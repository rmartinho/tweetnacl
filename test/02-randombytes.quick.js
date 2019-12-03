import nacl from './../nacl-fast-es.js';
import test from './helpers/teston.mjs';
import util from './helpers/nacl-util.mjs'

test('nacl.randomBytes', async function(t) {
  t.plan(1);
  var set = {}, s, i;

  for (i = 0; i < 10000; i++) {

    s = util.encodeBase64(nacl.randomBytes(32));
    if (set[s]) {
      t.fail('duplicate random sequence! ', s);
      return;
    }
    set[s] = true;
  }
  t.pass('no collisions');
});