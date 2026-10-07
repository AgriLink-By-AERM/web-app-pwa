// Contract fixtures only. These tests do not claim the real backend is online.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const modules = new Map();
const storage = new Map();
let handler, calls = [];
function load(name) {
  const file = path.resolve(__dirname, '../lib/farmtry', name + '.ts');
  if (modules.has(file)) return modules.get(file);
  const exports = {}; modules.set(file, exports);
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, require: relative => load(path.basename(relative)), process: { env: {} }, AbortController, URLSearchParams, setTimeout, clearTimeout,
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    fetch: async (url, options) => { calls.push({ url, ...options }); return handler(url, options); }
  }, { filename: file });
  return exports;
}
const client = load('client'), auth = load('auth'), aggregator = load('aggregator');
const ok = data => new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
const failure = status => new Response(JSON.stringify({ success: false, message: 'private stack or account details', error: { stack: 'DO NOT SHOW' } }), { status });
const log = { id: '64f1a2b3c4d5e6f7a8b9c0d1', farmerPhone: '08011223344', pipeline: 'waste', category: 'rice husks', weightKg: 250.5, condition: 'good', latitude: 6.5, longitude: 3.3, photoUrl: 'https://example.com/harvest.jpg', harvestedAt: '2026-10-01T10:00:00.000Z', status: 'pending', urgencyTier: 'low', qrPayload: 'fixture-uuid', createdAt: '2026-10-01T11:00:00.000Z' };
let passed = 0;
async function test(name, run) { calls = []; handler = () => ok(undefined); await run(); passed++; console.log('PASS ' + name); }
const body = index => JSON.parse(calls[index ?? calls.length - 1].body);
(async () => {
  await test('login uses documented body, cookies, no-store and saves only logout reference', async () => {
    handler = () => ok({ user: { role: 'aggregator' }, sessionId: 'session-1' });
    await auth.login(' user@example.com ', 'fixture-password');
    assert.equal(calls[0].url, 'https://farmtry-core-engine.onrender.com/api/v1/auth/login');
    assert.deepEqual(body(), { emailOrPhone: 'user@example.com', password: 'fixture-password' });
    assert.equal(calls[0].credentials, 'include'); assert.equal(calls[0].cache, 'no-store'); assert.equal(calls[0].redirect, 'error');
    assert.deepEqual([...storage.values()], ['session-1']); assert.equal(calls[0].headers.Authorization, undefined);
  });
  await test('malformed login does not create a session', async () => { client.clearSession(); handler = () => ok({ user: {} }); await assert.rejects(auth.login('a@b.com', 'fixture'), error => error.kind === 'contract'); assert.equal(client.currentSession(), null); });
  await test('401 remains a real failure and does not expose server errors', async () => { handler = () => failure(401); await assert.rejects(auth.login('a@b.com', 'fixture'), error => error.kind === 'unauthorized' && !error.message.includes('private')); });
  for (const [status, kind] of [[400,'validation'],[403,'forbidden'],[404,'not-found'],[409,'conflict'],[422,'validation'],[429,'rate-limit'],[500,'server']]) await test(`HTTP ${status} is a distinct ${kind} failure`, async () => { handler = () => failure(status); await assert.rejects(client.request('/test', client.record), error => error.kind === kind && error.status === status); });
  await test('429 Retry-After is available to resend cooldown', async () => { handler = () => new Response('', { status: 429, headers: { 'Retry-After': '90' } }); await assert.rejects(auth.resendOtp('fixture@example.com'), error => error.retryAfter === 90); });
  await test('network errors never return fabricated success', async () => { handler = () => { throw new TypeError('offline'); }; await assert.rejects(auth.forgotPassword({ email: 'fixture@example.com' }), error => error.kind === 'network'); });
  await test('non-JSON and negative success envelopes are rejected', async () => { handler = () => new Response('<html>proxy error</html>'); await assert.rejects(client.request('/test', client.record), error => error.kind === 'contract'); handler = () => new Response('{"success":false}'); await assert.rejects(client.request('/test', client.record), error => error.kind === 'contract'); });
  await test('password recovery uses email or phone and never relies on account-disclosing text', async () => { await auth.forgotPassword({ email: 'fixture@example.com' }); assert.deepEqual(body(), { email: 'fixture@example.com' }); await auth.forgotPassword({ phone: '08012345678' }); assert.deepEqual(body(), { phone: '08012345678' }); assert.ok(calls.every(call => call.url.endsWith('/auth/forgot-password'))); });
  await test('reset submits token/newPassword and clears session only on confirmed success', async () => { client.saveSession('old-session'); handler = () => failure(400); await assert.rejects(auth.resetPassword('a'.repeat(64), 'abcdefgh')); assert.equal(client.currentSession(), 'old-session'); handler = () => ok(); await auth.resetPassword('a'.repeat(64), 'abcdefgh'); assert.deepEqual(body(), { token: 'a'.repeat(64), newPassword: 'abcdefgh' }); assert.equal(client.currentSession(), null); });
  await test('invalid reset tokens cannot send requests', async () => { await assert.rejects(auth.resetPassword('012345', 'abcdefgh')); assert.equal(calls.length, 0); });
  await test('OTP preserves leading zeros and never persists the access token', async () => { handler = () => ok({ user: {}, token: { accessToken: 'fixture-access-token' } }); await auth.verifyOtp('fixture@example.com', '012345'); assert.deepEqual(body(), { email: 'fixture@example.com', code: '012345' }); assert.equal([...storage.values()].includes('fixture-access-token'), false); });
  await test('resend OTP uses email, not reset-token or code fields', async () => { await auth.resendOtp('fixture@example.com'); assert.ok(calls[0].url.endsWith('/auth/resend-otp')); assert.deepEqual(body(), { email: 'fixture@example.com' }); });
  await test('logout retains session after a failed request', async () => { client.saveSession('session-logout'); handler = () => failure(500); await assert.rejects(auth.logout()); assert.equal(client.currentSession(), 'session-logout'); handler = () => ok(); await auth.logout(); assert.deepEqual(body(), { sessionId: 'session-logout' }); assert.equal(client.currentSession(), null); });
  await test('concurrent protected reads share a single refresh, with no refresh body for web', async () => {
    let authorized = false, refreshes = 0;
    handler = async url => { if (url.endsWith('/auth/refresh-token')) { refreshes++; await new Promise(resolve => setTimeout(resolve, 5)); authorized = true; return ok({ sessionId: 'renewed' }); } return authorized ? ok({ value: true }) : failure(401); };
    await Promise.all([client.authenticatedRead('/one', client.record), client.authenticatedRead('/two', client.record)]);
    assert.equal(refreshes, 1); assert.equal(client.currentSession(), 'renewed'); assert.equal(calls.find(call => call.url.endsWith('/auth/refresh-token')).body, undefined);
  });
  await test('read retries only once when refreshed cookie is still rejected', async () => { handler = url => url.endsWith('/auth/refresh-token') ? ok({ sessionId: 'renewed' }) : failure(401); await assert.rejects(client.authenticatedRead('/one', client.record)); assert.equal(calls.length, 3); });
  await test('empty logs are a valid empty result; pagination is encoded', async () => { handler = () => ok({ logs: [], total: 0, page: 1, limit: 20 }); const result = await aggregator.getLogs({ page: 1, status: '', category: 'rice & maize', pipeline: 'waste' }); assert.equal(result.logs.length, 0); assert.equal(result.total, 0); const url = new URL(calls[0].url); assert.equal(url.searchParams.get('category'), 'rice & maize'); assert.equal(url.searchParams.get('limit'), '20'); });
  await test('invalid DTOs are rejected instead of guessing aliases and records', async () => { handler = () => ok({ logs: [{ ...log, id: undefined, _id: log.id }], total: 1, page: 1, limit: 20 }); await assert.rejects(aggregator.getLogs({ page: 1, status: '', category: '', pipeline: '' }), error => error.kind === 'contract'); });
  await test('read detail uses exact ObjectId and preserves server statuses', async () => { handler = () => ok({ ...log, status: 'verified' }); const result = await aggregator.getLog(log.id); assert.equal(result.status, 'verified'); assert.ok(calls[0].url.endsWith('/aggregator/logs/' + log.id)); await assert.rejects(async () => aggregator.getLog('../admin')); assert.equal(calls.length, 1); });
  await test('dashboard uses documented counters, not fabricated cash or performance', async () => { handler = () => ok({ profile: { id: 'agg', fullName: 'Fixture User', email: 'fixture@example.com', phone: '08012345678', zone: 'Lagos-North', kycStatus: 'approved' }, stats: { totalLogs: 0, pendingLogs: 0, verifiedLogs: 0, totalWeightKg: 0, openDisputes: 0 }, recentLogs: [] }); const result = await aggregator.getDashboard(); assert.equal(result.stats.totalLogs, 0); assert.equal(result.profile.cashFloatBalance, undefined); });
  await test('KYC status and review booleans are validated', async () => { handler = () => ok({ kycStatus: 'pending', reviewSteps: [{ label: 'Review', done: false }] }); assert.equal((await aggregator.getStatus()).reviewSteps[0].done, false); handler = () => ok({ kycStatus: 'approved', reviewSteps: [{ label: 'Review', done: 'yes' }] }); await assert.rejects(aggregator.getStatus()); });
  await test('registration transmits entered values and never creates a local profile', async () => { const input = { fullName: 'Fixture User', email: 'fixture@example.com', password: 'fixture-only', phone: '08012345678', zone: 'Lagos-North', governmentIdType: 'nin', governmentIdNumber: '12345678901', governmentIdPhotoUrl: 'https://example.com/id.jpg', guarantorPhone: '08099887766' }; handler = () => ok({ userId: 'fixture', fullName: input.fullName, email: input.email, role: 'aggregator', status: 'pending', aggregator: {} }); await auth.registerAggregator(input); assert.deepEqual(body(), input); assert.ok(calls[0].url.endsWith('/auth/aggregator/register')); });
  await test('create log uses server ID and QR reference; failed mutations never auto-retry', async () => { const { id, status, urgencyTier, qrPayload, createdAt, ...input } = log; handler = () => ok(log); const result = await aggregator.createLog(input); assert.equal(result.id, log.id); assert.equal(result.qrPayload, 'fixture-uuid'); assert.deepEqual(body(), input); calls = []; handler = () => failure(401); await assert.rejects(aggregator.createLog(input)); assert.equal(calls.length, 1); });
  await test('dispute uses optional fields only when supplied and requires server reference', async () => { const input = { logId: log.id, reason: 'Incorrect weight', contactPhone: '08012345678' }; handler = () => ok({ disputeId: 'dispute-real', logId: log.id, reason: input.reason, status: 'open', createdAt: log.createdAt }); assert.equal((await aggregator.fileDispute(input)).disputeId, 'dispute-real'); assert.deepEqual(body(), input); handler = () => ok({ status: 'open' }); await assert.rejects(aggregator.fileDispute(input), error => error.kind === 'contract'); });
  console.log(`${passed} contract and failure-path tests passed. Real backend connectivity remains a separate check.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
