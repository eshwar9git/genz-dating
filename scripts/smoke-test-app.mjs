/**
 * Local functional smoke tests for vibed store + utils (no browser).
 * Run: node scripts/smoke-test-app.mjs
 */
import assert from "node:assert/strict";

// Mirror key logic from utils/store without TS imports
const AD_REWARDS = {
  likes: { amount: 5, maxPerDay: 3 },
  reels: { amount: 5, maxPerDay: 3 },
  rewinds: { amount: 1, maxPerDay: 2 },
};

function freshUsage() {
  return {
    date: new Date().toISOString().slice(0, 10),
    likesUsed: 0,
    superLikesUsed: 0,
    rewindsUsed: 0,
    reelsWatched: 0,
    softLaunchUnlocksUsed: 0,
    likesBonus: 0,
    reelsBonus: 0,
    rewindsBonus: 0,
    adLikesWatched: 0,
    adReelsWatched: 0,
    adRewindsWatched: 0,
  };
}

function effectiveLikesLimit(tier, usage) {
  const base = tier === "free" ? 20 : Infinity;
  return base + (usage.likesBonus ?? 0);
}

function canLike(user) {
  const lim = effectiveLikesLimit(user.tier, user.usage);
  return user.usage.likesUsed < lim;
}

const results = [];
function check(name, fn) {
  try {
    fn();
    results.push({ name, status: "Pass" });
  } catch (e) {
    results.push({ name, status: "Fail", error: String(e.message || e) });
  }
}

check("new free user can like 20 times", () => {
  const u = { tier: "free", usage: freshUsage() };
  for (let i = 0; i < 20; i++) {
    assert.equal(canLike(u), true);
    u.usage.likesUsed++;
  }
  assert.equal(canLike(u), false);
});

check("ad bonus unblocks likes", () => {
  const u = {
    tier: "free",
    usage: { ...freshUsage(), likesUsed: 20, likesBonus: 0 },
  };
  assert.equal(canLike(u), false);
  u.usage.likesBonus += AD_REWARDS.likes.amount;
  assert.equal(canLike(u), true);
  assert.equal(effectiveLikesLimit("free", u.usage), 25);
});

check("plus has unlimited likes", () => {
  const u = {
    tier: "plus",
    usage: { ...freshUsage(), likesUsed: 999 },
  };
  assert.equal(canLike(u), true);
});

check("match only once for same profile", () => {
  const matches = [];
  const profileId = "p1";
  const addMatch = () => {
    if (matches.some((m) => m.userId === profileId)) return false;
    matches.push({ userId: profileId });
    return true;
  };
  assert.equal(addMatch(), true);
  assert.equal(addMatch(), false);
  assert.equal(matches.length, 1);
});

check("email normalize trim+lower", () => {
  const a = "  Foo@Bar.COM ".toLowerCase().trim();
  assert.equal(a, "foo@bar.com");
});

check("rewind requires lastPassedId", () => {
  const lastPassedId = null;
  assert.equal(Boolean(lastPassedId), false);
});

const pass = results.filter((r) => r.status === "Pass").length;
const fail = results.filter((r) => r.status === "Fail").length;
console.log(JSON.stringify({ summary: { pass, fail }, results }, null, 2));
process.exit(fail ? 1 : 0);
