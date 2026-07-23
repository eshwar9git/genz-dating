/**
 * Headless smoke tests for usage limits + rewarded ads (no browser).
 * Run: node scripts/smoke-test-ads.mjs
 */
import assert from "node:assert/strict";

const AD_REWARDS = {
  likes: { amount: 5, maxPerDay: 3 },
  reels: { amount: 5, maxPerDay: 3 },
  rewinds: { amount: 1, maxPerDay: 2 },
};

const FREE = {
  likesPerDay: 20,
  rewindsPerDay: 1,
  reelsWatchPerDay: 15,
};

function freshUsage() {
  return {
    likesUsed: 0,
    likesResetAt: new Date(Date.now() + 864e5).toISOString(),
    superLikesUsed: 0,
    rewindsUsed: 0,
    reelsWatched: 0,
    reelsPosted: 0,
    boostsUsed: 0,
    softLaunchUnlocksUsed: 0,
    likesBonus: 0,
    reelsBonus: 0,
    rewindsBonus: 0,
    adLikesWatched: 0,
    adReelsWatched: 0,
    adRewindsWatched: 0,
  };
}

function effective(base, bonus) {
  if (!Number.isFinite(base)) return base;
  return base + bonus;
}

function canLike(u) {
  return u.likesUsed < effective(FREE.likesPerDay, u.likesBonus);
}
function canRewind(u) {
  return u.rewindsUsed < effective(FREE.rewindsPerDay, u.rewindsBonus);
}
function canWatchReel(u) {
  return u.reelsWatched < effective(FREE.reelsWatchPerDay, u.reelsBonus);
}
function canWatchAd(u, kind) {
  const key =
    kind === "likes"
      ? "adLikesWatched"
      : kind === "reels"
        ? "adReelsWatched"
        : "adRewindsWatched";
  return u[key] < AD_REWARDS[kind].maxPerDay;
}
function claim(u, kind) {
  if (!canWatchAd(u, kind)) return { blocked: "limit" };
  const cfg = AD_REWARDS[kind];
  if (kind === "likes") {
    u.likesBonus += cfg.amount;
    u.adLikesWatched += 1;
  } else if (kind === "reels") {
    u.reelsBonus += cfg.amount;
    u.adReelsWatched += 1;
  } else {
    u.rewindsBonus += cfg.amount;
    u.adRewindsWatched += 1;
  }
  return { amount: cfg.amount };
}

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, status: "Pass" });
  } catch (e) {
    results.push({ name, status: "Fail", error: String(e.message || e) });
  }
}

test("fresh user can like", () => {
  const u = freshUsage();
  assert.equal(canLike(u), true);
});

test("20 likes blocks without ad", () => {
  const u = freshUsage();
  u.likesUsed = 20;
  assert.equal(canLike(u), false);
});

test("ad grants +5 likes and unblocks", () => {
  const u = freshUsage();
  u.likesUsed = 20;
  const r = claim(u, "likes");
  assert.equal(r.amount, 5);
  assert.equal(u.likesBonus, 5);
  assert.equal(canLike(u), true);
  u.likesUsed = 25;
  assert.equal(canLike(u), false);
});

test("likes ad cap is 3/day", () => {
  const u = freshUsage();
  for (let i = 0; i < 3; i++) assert.ok(!claim(u, "likes").blocked);
  assert.equal(claim(u, "likes").blocked, "limit");
  assert.equal(u.likesBonus, 15);
});

test("rewind ad grants +1", () => {
  const u = freshUsage();
  u.rewindsUsed = 1;
  assert.equal(canRewind(u), false);
  claim(u, "rewinds");
  assert.equal(canRewind(u), true);
  assert.equal(claim(u, "rewinds").amount, 1);
  assert.equal(claim(u, "rewinds").blocked, "limit");
});

test("reels ad grants +5 after 15 used", () => {
  const u = freshUsage();
  u.reelsWatched = 15;
  assert.equal(canWatchReel(u), false);
  claim(u, "reels");
  assert.equal(canWatchReel(u), true);
  u.reelsWatched = 20;
  assert.equal(canWatchReel(u), false);
});

test("remaining label math", () => {
  const left = (used, limit) => Math.max(0, limit - used);
  assert.equal(left(18, 20), 2);
  assert.equal(left(20, 25), 5); // after one likes ad
});

console.log(JSON.stringify({ summary: {
  pass: results.filter((r) => r.status === "Pass").length,
  fail: results.filter((r) => r.status === "Fail").length,
}, results }, null, 2));
process.exit(results.some((r) => r.status === "Fail") ? 1 : 0);
