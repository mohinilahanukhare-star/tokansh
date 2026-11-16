import type {Role} from './scenario';

/** Demo-only browser session. This is not authentication or authorization. */
export const DEMO_SESSION_KEY='tokansh-preview-role-v1';
export function isDemoRole(value:unknown):value is Role {
 return value==='ISSUER'||value==='INVESTOR'||value==='LENDER';
}
export type SessionStorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export function readDemoSession(store?:SessionStorageLike|null):Role|null {
 try {
  const storage=store===undefined?(typeof window==='undefined'?null:window.sessionStorage):store;
  const role=storage?.getItem(DEMO_SESSION_KEY);
  return isDemoRole(role)?role:null;
 }catch {return null;}
}
export function writeDemoSession(role:Role,store?:SessionStorageLike|null):void {
 try {
  const storage=store===undefined?(typeof window==='undefined'?null:window.sessionStorage):store;
  storage?.setItem(DEMO_SESSION_KEY,role);
 }catch {/* In-memory state still permits preview in privacy-restricted browsers. */}
}
export function clearDemoSession(store?:SessionStorageLike|null):void {
 try {
  const storage=store===undefined?(typeof window==='undefined'?null:window.sessionStorage):store;
  storage?.removeItem(DEMO_SESSION_KEY);
 }catch {/* Session is still cleared from React state. */}
}
