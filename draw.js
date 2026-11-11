// Pure draw logic shared by landing.html and screen.html. check.mjs covers it.
(function (root) {
  const INDIC = "٠١٢٣٤٥٦٧٨٩", PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
  const COMPOUND = /^(عبد|abd|abdul|abdel)$/i;

  // Unbiased 0..n-1 from the browser's secure random source.
  function randInt(n) {
    const limit = Math.floor(0x100000000 / n) * n, b = new Uint32Array(1);
    do { crypto.getRandomValues(b); } while (b[0] >= limit);
    return b[0] % n;
  }

  // Returns the 9-digit national number (5XXXXXXXX) or null.
  function normalizePhone(raw) {
    const d = String(raw)
      .replace(/[٠-٩]/g, c => INDIC.indexOf(c))
      .replace(/[۰-۹]/g, c => PERSIAN.indexOf(c))
      .replace(/[^\d+]/g, "")
      .replace(/^(\+|00)?966/, "")
      .replace(/^0/, "");
    return /^5\d{8}$/.test(d) ? d : null;
  }

  // What the room sees: first name + family initial. Never the full number.
  function publicName(name) {
    const w = String(name).trim().split(/\s+/);
    const n = COMPOUND.test(w[0]) && w.length > 1 ? 2 : 1;
    const first = w.slice(0, n).join(" ");
    if (w.length <= n) return first;
    const family = w[w.length - 1].replace(/^ال/, "");
    return first + " " + family[0] + ".";
  }

  const lastFour = phone => String(phone).slice(-4);

  function createDraw(entries, rand = randInt) {
    const out = new Set(), winners = [];
    const d = {
      entry: null, winners,
      pool: () => entries.filter(e => !out.has(e.id)),
      pickWinner() { const p = d.pool(); return (d.entry = p.length ? p[rand(p.length)] : null); },
      confirm() { winners.push(d.entry); out.add(d.entry.id); d.entry = null; },
      skip() { out.add(d.entry.id); d.entry = null; },
    };
    return d;
  }

  const api = { randInt, normalizePhone, publicName, lastFour, createDraw };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Draw = api;
})(typeof window === "undefined" ? globalThis : window);
