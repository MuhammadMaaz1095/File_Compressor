import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareFileSizes,
  formatBytes,
  formatReductionPercent,
  getComparisonSummary,
} from '../lib/compression/file-size.ts';

test('compareFileSizes: handles output much smaller than input', () => {
  const original = 10 * 1024 * 1024; // 10 MB
  const output = 3.5 * 1024 * 1024;  // 3.5 MB
  const res = compareFileSizes(original, output);

  assert.equal(res.outcome, 'reduced');
  assert.equal(res.outputIsLarger, false);
  assert.equal(res.outputIsUnchanged, false);
  assert.equal(res.savedBytes, original - output);
  assert.equal(res.reductionPercent, 65);
  assert.equal(res.increasePercent, 0);
});

test('compareFileSizes: handles output slightly smaller than input', () => {
  const original = 1000;
  const output = 980;
  const res = compareFileSizes(original, output);

  assert.equal(res.outcome, 'reduced');
  assert.equal(res.savedBytes, 20);
  assert.equal(res.reductionPercent, 2);
  assert.equal(res.outputIsLarger, false);
});

test('compareFileSizes: handles equal sizes (unchanged)', () => {
  const original = 500000;
  const output = 500000;
  const res = compareFileSizes(original, output);

  assert.equal(res.outcome, 'unchanged');
  assert.equal(res.outputIsUnchanged, true);
  assert.equal(res.outputIsLarger, false);
  assert.equal(res.savedBytes, 0);
  assert.equal(res.reductionPercent, 0);
  assert.equal(res.increasePercent, 0);
});

test('compareFileSizes: handles output larger than input honestly without clamping', () => {
  const original = 1000;
  const output = 1500;
  const res = compareFileSizes(original, output);

  assert.equal(res.outcome, 'larger');
  assert.equal(res.outputIsLarger, true);
  assert.equal(res.outputIsUnchanged, false);
  assert.equal(res.savedBytes, -500);
  assert.equal(res.increaseBytes, 500);
  // Negative reduction percentage must remain negative
  assert.equal(res.reductionPercent, -50);
  // Positive increase percentage
  assert.equal(res.increasePercent, 50);
});

test('compareFileSizes: handles empty original input (0 bytes)', () => {
  const res = compareFileSizes(0, 500);
  assert.equal(res.outcome, 'larger');
  assert.equal(res.outputIsLarger, true);
  assert.equal(res.reductionPercent, 0);

  const resEqual = compareFileSizes(0, 0);
  assert.equal(resEqual.outcome, 'unchanged');
  assert.equal(resEqual.outputIsUnchanged, true);
});

test('compareFileSizes: handles zero-byte output', () => {
  const res = compareFileSizes(1000, 0);
  assert.equal(res.outcome, 'reduced');
  assert.equal(res.savedBytes, 1000);
  assert.equal(res.reductionPercent, 100);
});

test('compareFileSizes: rejects invalid negative or non-finite values', () => {
  assert.throws(() => compareFileSizes(-100, 500));
  assert.throws(() => compareFileSizes(500, -10));
  assert.throws(() => compareFileSizes(NaN, 500));
  assert.throws(() => compareFileSizes(500, Infinity));
});

test('formatBytes: boundary tests (B, KB, MB, GB)', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024), '1 MB');
  assert.equal(formatBytes(4.51 * 1024 * 1024, 2), '4.51 MB');
  assert.equal(formatBytes(9.51 * 1024 * 1024, 2), '9.51 MB');
});

test('formatReductionPercent: truthful positive, negative, and zero representations', () => {
  assert.equal(formatReductionPercent(35.2), '-35.2%');
  assert.equal(formatReductionPercent(-110.86), '+110.9%');
  assert.equal(formatReductionPercent(0), '0%');
});

test('getComparisonSummary: provides truthful user-facing messages', () => {
  const reduced = compareFileSizes(1000, 600);
  const summaryReduced = getComparisonSummary(reduced);
  assert.equal(summaryReduced.badgeType, 'success');
  assert.match(summaryReduced.headline, /saved/i);

  const larger = compareFileSizes(1000, 1600);
  const summaryLarger = getComparisonSummary(larger);
  assert.equal(summaryLarger.badgeType, 'warning');
  assert.match(summaryLarger.headline, /larger/i);
});
