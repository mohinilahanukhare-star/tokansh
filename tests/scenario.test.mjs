import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarioProperty,scenarioHoldings,scenarioEvents,scenarioEntitlement,inr,phases,ledgerUnavailable} from '../src/demo/scenario.ts';

test('onboarding starts without registered, committed or issued assets',()=>{
 const p=scenarioProperty('ONBOARDING'),h=scenarioHoldings('ONBOARDING');
 assert.equal(p.issued,0);assert.equal(p.approval,'DRAFT');assert.equal(h.owned,0);assert.equal(h.available,0);
});
test('approved property preview has no issued units until issuance phase',()=>{
 assert.equal(scenarioProperty('APPROVED').issued,0);
 assert.equal(scenarioProperty('ISSUED').issued,100000);
});
test('baseline investor purchase is exactly 500 ANSH, ₹50 lakh',()=>{
 const h=scenarioHoldings('PURCHASED');assert.equal(h.owned,500);assert.equal(h.pledged,0);assert.equal(h.available,500);assert.equal(h.acquisitionValue,'5000000');
 assert.equal(inr(h.acquisitionValue),'₹50,00,000');
});
test('baseline pledge is exactly 200 units with 300 available',()=>{
 const h=scenarioHoldings('PLEDGED');assert.equal(h.owned,500);assert.equal(h.pledged,200);assert.equal(h.available,300);
 assert.ok(350>h.available);
});
test('full release restores 500 transferable units',()=>{
 const h=scenarioHoldings('RELEASED');assert.equal(h.owned,500);assert.equal(h.pledged,0);assert.equal(h.available,500);
});
test('record-date example entitlement is 5000 rupees (illustrative only)',()=>{
 const p=scenarioEntitlement('PLEDGED');assert.equal(p.eligibleUnits,500);assert.equal(p.entitlement,'5000');assert.equal(p.verified,false);
});
test('preview states never fabricate committed DRUNIX evidence',()=>{
 for(const p of phases){for(const e of scenarioEvents(p.id)){
  assert.equal(e.appStatus,'PREVIEW_ONLY');assert.equal(e.ledger.verified,false);assert.equal(e.ledger.transactionId,null);
 }}
 assert.equal(ledgerUnavailable.state,'NOT_CONNECTED');
});
