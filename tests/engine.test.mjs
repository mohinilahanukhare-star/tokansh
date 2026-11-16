import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState, availableUnits, pledgedUnits, placeTrade,
  retryTrade, requestPledge, decidePledge, repayPledge,
  releasePledge, issueAnsh, recordDistribution, applyShock, transferAnsh
} from '../src/mock/engine.ts';

test('seeded ANSH balances distinguish owned from locked', () => {
  const s=initialState();
  assert.equal(s.ownedUnits,5240);
  assert.equal(pledgedUnits(s),1000);
  assert.equal(availableUnits(s),4240);
});
test('failed payment does not update ownership and retry updates exactly once', () => {
  const before=initialState();
  const failed=placeTrade(before,'BUY',20,true);
  assert.equal(failed.ownedUnits,before.ownedUnits);
  assert.equal(failed.trades[0].status,'PAYMENT_FAILED');
  const retried=retryTrade(failed,failed.trades[0].id);
  assert.equal(retried.ownedUnits,before.ownedUnits+20);
  assert.equal(retried.trades[0].status,'COMMITTED');
  assert.throws(()=>retryTrade(retried,retried.trades[0].id),/cannot be retried/);
});
test('pledged units cannot be sold', () => {
  const s=initialState();
  assert.throws(()=>placeTrade(s,'SELL',4241,false),/Transfer blocked/);
  assert.equal(placeTrade(s,'SELL',1,false).ownedUnits,5239);
});
test('pledge approval, repayment, release restore transferable balance', () => {
  let s=initialState();
  s=requestPledge(s,100);
  const id=s.pledges[0].id;
  assert.equal(s.pledges[0].status,'REQUESTED');
  s=decidePledge(s,id,true);
  assert.equal(availableUnits(s),4140);
  s=repayPledge(s,id);
  assert.equal(availableUnits(s),4140);
  s=releasePledge(s,id);
  assert.equal(availableUnits(s),4240);
});
test('issuance and distribution enforce caps and store lifecycle events', () => {
  let s=initialState();
  s=issueAnsh(s,2000);
  assert.equal(s.issuedUnits,82000);
  assert.throws(()=>issueAnsh(s,20000),/capacity/);
  s=recordDistribution(s,10,'2026-11-30');
  assert.equal(s.distributions[0].total,820000);
});
test('indicative scenario does not change unit ownership', () => {
  const a=initialState();
  const b=applyShock(a,-12);
  assert.equal(b.ownedUnits,a.ownedUnits);
  assert.equal(b.valuationShock,-12);
});

test('direct transfer reduces sender balance and respects pledged restrictions',()=>{
  const s=initialState();
  assert.throws(()=>transferAnsh(s,4241,'usr_investor_02'),/Transfer blocked/);
  const transferred=transferAnsh(s,50,'usr_investor_02');
  assert.equal(transferred.ownedUnits,5190);
  assert.equal(transferred.trades[0].payment,'NOT_REQUIRED');
  assert.equal(transferred.events[0].kind,'TRANSFER');
});
