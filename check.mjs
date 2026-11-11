import assert from "node:assert";
import { createRequire } from "node:module";
const { normalizePhone: n, publicName: p, lastFour, createDraw, randInt } = createRequire(import.meta.url)("./draw.js");

for (const ok of ["0501234417", "501234417", "+966501234417", "00966501234417", "966 50 123 4417", "٠٥٠١٢٣٤٤١٧", "۰۵۰۱۲۳۴۴۱۷"])
  assert.equal(n(ok), "501234417", ok);
for (const bad of ["", "12345", "0401234417", "50123441", "5012344177"]) assert.equal(n(bad), null, bad);

assert.equal(p("Ahmed Al Ghamdi"), "Ahmed G.");
assert.equal(p("أحمد الغامدي"), "أحمد غ.");
assert.equal(p("عبد الله الغامدي"), "عبد الله غ.");
assert.equal(p("عبد الله"), "عبد الله");
assert.equal(p("  Khalid  "), "Khalid");
assert.equal(lastFour("501234417"), "4417");

const entries = Array.from({ length: 20 }, (_, i) => ({ id: i }));
for (let run = 0; run < 300; run++) {
  const d = createDraw(entries);
  d.pickWinner();
  const skipped = d.entry.id;
  d.skip();
  while (d.pool().length) {
    d.pickWinner();
    assert.notEqual(d.entry.id, skipped, "skipped entrant cannot return");
    d.confirm();
  }
  assert.equal(new Set(d.winners.map(e => e.id)).size, 19, "no repeat winners");
  assert.equal(d.pickWinner(), null, "exhausted pool returns null");
}

const seen = new Array(6).fill(0);
for (let i = 0; i < 60000; i++) seen[randInt(6)]++;
assert.ok(seen.every(c => Math.abs(c - 10000) < 500), "randInt roughly uniform: " + seen);
console.log("ok");
