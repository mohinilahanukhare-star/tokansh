/**
 * Read-only UI scenario fixtures. This is NOT a mock ledger or a simulated
 * committed transaction. The selected phase is an illustrative preview only.
 */
export type Role = 'ISSUER'|'INVESTOR'|'LENDER';
export type Phase = 'ONBOARDING'|'APPROVED'|'ISSUED'|'PURCHASED'|'PLEDGED'|'RELEASED';
export const phases: {id:Phase;label:string;description:string}[]=[
  {id:'ONBOARDING',label:'1. Onboarding',description:'Asset not yet approved'},
  {id:'APPROVED',label:'2. Approved',description:'Illustrative application approval'},
  {id:'ISSUED',label:'3. Issued',description:'Illustrative 100,000 ANSH issuance'},
  {id:'PURCHASED',label:'4. Purchased',description:'Illustrative purchase of 500 ANSH'},
  {id:'PLEDGED',label:'5. Pledged',description:'Illustrative pledge of 200 ANSH'},
  {id:'RELEASED',label:'6. Released',description:'Illustrative full release after repayment'}
];
export type LedgerEvidence = {state:'NOT_CONNECTED'; transactionId:null; verified:false; source:'UI_PREVIEW'};
export type PropertyPreview={id:string;name:string;location:string;type:string;valuation:string;approvedSupply:number;unitPrice:string;issuer:string;approval:'DRAFT'|'APPROVED';issuance:'NOT_ISSUED'|'ILLUSTRATIVE';issued:number;status:'NOT_LIVE'};
export type HoldingPreview={owned:number;pledged:number;available:number;acquisitionValue:string;indicativeValue:string;source:'UI_PREVIEW';asOf:string};
export type EventPreview={id:string;actor:Role;kind:string;description:string;appStatus:'PREVIEW_ONLY';ledger:LedgerEvidence;time:string};
export const ledgerUnavailable:LedgerEvidence={state:'NOT_CONNECTED',transactionId:null,verified:false,source:'UI_PREVIEW'};
export const propertyImage='https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=80';
export const sample={
  id:'TECHPARK-ONE',name:'TechPark One',location:'Bengaluru, Karnataka',type:'Commercial office',
  valuation:'1000000000',approvedSupply:100000,unitPrice:'10000',issuer:'Meera · Demo issuer',
  currency:'INR',recordDate:'2026-11-15',distribution:'1000000',loan:'1200000',ltv:60,
  distributionPeriod:'November 2026'
};
export function inr(value:string|number,short=false):string {
 const amount=typeof value==='string'?Number(value):value;
 if(!Number.isFinite(amount))return '—';
 if(short&&Math.abs(amount)>=10000000)return '₹'+(amount/10000000).toFixed(2)+' Cr';
 if(short&&Math.abs(amount)>=100000)return '₹'+(amount/100000).toFixed(2)+' L';
 return '₹'+amount.toLocaleString('en-IN',{maximumFractionDigits:2});
}
export function integer(value:number):string {return value.toLocaleString('en-IN');}
export function phaseIndex(p:Phase):number {return phases.findIndex(x=>x.id===p);}
export function scenarioProperty(phase:Phase):PropertyPreview{
 const i=phaseIndex(phase);
 return {id:sample.id,name:sample.name,location:sample.location,type:sample.type,
 valuation:sample.valuation,approvedSupply:sample.approvedSupply,unitPrice:sample.unitPrice,issuer:sample.issuer,
 approval:i>=1?'APPROVED':'DRAFT',issuance:i>=2?'ILLUSTRATIVE':'NOT_ISSUED',
 issued:i>=2?100000:0,status:'NOT_LIVE'};
}
export function scenarioHoldings(phase:Phase):HoldingPreview{
 const i=phaseIndex(phase);
 const owned=i>=3?500:0,pledged=i===4?200:0;
 return {owned,pledged,available:owned-pledged,acquisitionValue:String(owned*10000),
 indicativeValue:String(owned*10000),source:'UI_PREVIEW',asOf:'Illustrative — no ledger snapshot'};
}
export function scenarioEvents(phase:Phase):EventPreview[]{
 const i=phaseIndex(phase);
 const entries:[number,Role,string,string][]=[
  [0,'ISSUER','PROPERTY_DRAFT','TechPark One onboarding record prepared'],
  [1,'ISSUER','PROPERTY_APPROVAL','Application approval scenario selected'],
  [2,'ISSUER','ISSUANCE','100,000 ANSH issuance scenario selected'],
  [3,'INVESTOR','PURCHASE','500 ANSH purchase scenario selected'],
  [4,'INVESTOR','PLEDGE','200 ANSH pledge scenario selected'],
  [5,'LENDER','RELEASE','Full repayment and collateral release scenario selected']
 ];
 return entries.filter(x=>x[0]<=i).map((x,n)=>({id:'PREVIEW-'+String(n+1).padStart(3,'0'),
  actor:x[1],kind:x[2],description:x[3],appStatus:'PREVIEW_ONLY' as const,ledger:ledgerUnavailable,time:'Illustrative'})).reverse();
}
export function scenarioEntitlement(phase:Phase) {
 const h=scenarioHoldings(phase);
 // Illustration ONLY: 500 / 100000 * 1000000 = 5000.
 return {eligibleUnits:h.owned,totalUnits:100000,totalAmount:'1000000',
 entitlement:String(Math.round(h.owned/100000*1000000)),
 source:'UI_PREVIEW_SNAPSHOT' as const, verified:false};
}
export const roleOptions:{role:Role;label:string;description:string}[]=[
 {role:'ISSUER',label:'Admin / Issuer (Meera)',description:'Property registry, approval, issuance, distribution'},
 {role:'INVESTOR',label:'Investor (Aarav)',description:'Marketplace, portfolio, purchases, pledge, income'},
 {role:'LENDER',label:'Lender',description:'Simulated financing, assessment and collateral review'}
];
export function phaseHelp(p:Phase):string{return phases.find(x=>x.id===p)?.description||'';}
