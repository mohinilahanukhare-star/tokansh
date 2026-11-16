import test from 'node:test';
import assert from 'node:assert/strict';
import {isDemoRole,readDemoSession,writeDemoSession,clearDemoSession,DEMO_SESSION_KEY} from '../src/demo/session.ts';

function fakeSession(initial={}){
 const data=new Map(Object.entries(initial));
 return {
  getItem(key){return data.has(key)?data.get(key):null;},
  setItem(key,value){data.set(key,String(value));},
  removeItem(key){data.delete(key);}
 };
}
test('only the three approved demo roles are accepted',()=>{
 for(const role of ['ISSUER','INVESTOR','LENDER'])assert.equal(isDemoRole(role),true);
 for(const value of ['ADMIN','DEMO','',null,undefined,42])assert.equal(isDemoRole(value),false);
});
test('fresh visitor has no demo session',()=>{
 assert.equal(readDemoSession(fakeSession()),null);
});
test('login stores selected role and reload can restore it',()=>{
 const store=fakeSession();
 writeDemoSession('INVESTOR',store);
 assert.equal(store.getItem(DEMO_SESSION_KEY),'INVESTOR');
 assert.equal(readDemoSession(store),'INVESTOR');
});
test('logout clears stored role so direct routes must require sign-in again',()=>{
 const store=fakeSession();
 writeDemoSession('LENDER',store);
 clearDemoSession(store);
 assert.equal(readDemoSession(store),null);
});
test('invalid or stale stored roles are rejected',()=>{
 const store=fakeSession({[DEMO_SESSION_KEY]:'GUEST'});
 assert.equal(readDemoSession(store),null);
});
test('browser storage failures do not throw or fabricate a session',()=>{
 const broken={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
 assert.equal(readDemoSession(broken),null);
 assert.doesNotThrow(()=>writeDemoSession('ISSUER',broken));
 assert.doesNotThrow(()=>clearDemoSession(broken));
});
