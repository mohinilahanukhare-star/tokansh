import {useState} from 'react';
import {AlertTriangle,Landmark,LockKeyhole,ShieldCheck,Wallet} from 'lucide-react';
import {useApp} from '../app/context';
import {route} from '../api/contracts';
import type {NewPledge} from '../api/contracts';
import {phaseIndex,inr,integer,sample} from '../demo/scenario';
import {Button} from '../components/ui/button';
import {Card,Metric,SectionHeading,EmptyState} from '../components/ui/card';
import {ReviewDialog} from '../components/ui/dialog';
import {Field,DataRow} from '../components/ui/form';
import {Status} from '../components/ui/status';
export function Collateral(){
 const {phase,holding,submit,submitting,notify}=useApp();
 const [quantity,setQuantity]=useState(200),[transfer,setTransfer]=useState(350),[open,setOpen]=useState(false);
 const valid=Number.isSafeInteger(quantity)&&quantity>0&&quantity<=holding.available;
 const ltv=60;
 const payload:NewPledge={property_id:sample.id,quantity,loan_amount:String(quantity*10000*ltv/100)};
 function checkTransfer(){
   notify({kind:'info',text:transfer>holding.available?'EXPECTED POLICY REJECTION (preview): '+integer(transfer)+' ANSH exceeds the '+integer(holding.available)+' ANSH available. The Python backend and DRUNIX chaincode must independently enforce this.':'The entered amount is within the illustrative available units. No real transfer submitted.'});
 }
 return <><SectionHeading title="Collateral Management" description="Pledge eligible ANSH, view restrictions and monitor proposed financing exposure."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="Owned ANSH · preview" value={integer(holding.owned)} description="No live ownership projection"/><Metric label="Available ANSH · preview" value={integer(holding.available)} description="Available = owned − pledged"/><Metric label="Pledged ANSH · preview" value={integer(holding.pledged)} description="Locked stage only; not ledger proof"/></div>
 <div className="mt-5 grid gap-5 xl:grid-cols-2">
 <Card title="Request ANSH pledge" description="Only eligible, available ANSH may be pledged; REITs are ineligible">
 <form className="space-y-4" onSubmit={e=>{e.preventDefault();if(valid)setOpen(true);}}>
 <Field id="pledge-prop" label="Property" readOnly value={sample.name}/>
 <Field id="pledge-qty" label="ANSH units to pledge" type="number" min={1} max={holding.available} step={1} value={quantity} onChange={e=>setQuantity(Number(e.target.value))} error={quantity>holding.available?'Exceeds available ANSH (illustrative)':undefined}/>
 <dl><DataRow label="Indicative approved collateral unit value" value={inr(sample.unitPrice)}/><DataRow label="Illustrative collateral amount" value={inr(quantity*10000)}/><DataRow label="Illustrative LTV ratio" value={ltv+'%'}/><DataRow label="Proposed loan" value={inr(quantity*10000*ltv/100)}/><DataRow label="Pledge ledger state" value={<Status value="UNAVAILABLE"/>}/></dl>
 <Button type="submit" disabled={!valid||submitting||phaseIndex(phase)<3}>Review pledge request</Button>
 {phaseIndex(phase)<3&&<p className="text-xs text-amber-800">Select a purchased scenario to preview the pledge workflow.</p>}
 </form></Card>
 <Card title="Transfer restriction check" description="Scenario expected rejection; not proof of chaincode enforcement">
 <p className="text-sm leading-6 text-slate-600">When 500 ANSH are owned and 200 are pledged, only 300 remain eligible for transfer.</p>
 <Field id="transfer-qty" label="Attempted transfer quantity" type="number" min={1} step={1} value={transfer} onChange={e=>setTransfer(Number(e.target.value))}/>
 <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex items-center gap-2 font-semibold"><AlertTriangle size={17}/> Business-rule evaluation</div><p className="mt-1 text-xs leading-5">A transfer of 350 ANSH with only 300 available must be rejected by Python validation and independently by DRUNIX chaincode.</p></div>
 <Button variant="secondary" className="mt-4" onClick={checkTransfer}>Check expected transfer outcome</Button>
 <dl className="mt-5"><DataRow label="Illustrative pledge state" value={phase==='PLEDGED'?<Status value="PREVIEW_ONLY"/>:'No active ledger lock'}/><DataRow label="DRUNIX transaction reference" value="Not connected"/><DataRow label="Release policy" value="Only after full repayment and ledger commit"/></dl>
 </Card></div>
 <ReviewDialog open={open} onOpenChange={setOpen} title="Review collateral pledge" description="The frontend cannot lock units. Only a confirmed DRUNIX pledge transaction can restrict transfers." onConfirm={async()=>{await submit(route.pledges,payload);setOpen(false);}} busy={submitting} confirmLabel="Submit pledge request"><dl><DataRow label="Property" value={sample.name}/><DataRow label="Pledged units requested" value={integer(quantity)}/><DataRow label="Indicative collateral value" value={inr(quantity*10000)}/><DataRow label="Indicative loan value" value={inr(quantity*10000*.6)}/><DataRow label="Status after submission" value="Pending backend / DRUNIX verification"/></dl></ReviewDialog>
 </>;
}
export function Lending(){
 const {role,phase,holding,submit,submitting}=useApp();
 const [open,setOpen]=useState<'apply'|'assess'|'approve'|'reject'|'disburse'|'repay'|'release'|null>(null);
 const isLender=role==='LENDER',eligible=phaseIndex(phase)>=4;
 async function confirm(){
  // A real lender workflow requires genuine loan and pledge IDs from Python.
  // Never submit placeholder identifiers into production APIs.
  if(open&&open!=='apply'){
   await submit('/api/v1/system/status',{preview_action:open});
   setOpen(null);
   return;
  }
  const routes:Record<NonNullable<typeof open>,string>={
   apply:route.loans,
   assess:'/api/v1/loans/LOAN-ID/assess',
   approve:'/api/v1/loans/LOAN-ID/approve',
   reject:'/api/v1/loans/LOAN-ID/approve',
   disburse:'/api/v1/loans/LOAN-ID/disburse',
   repay:'/api/v1/loans/LOAN-ID/repayments',
   release:'/api/v1/collateral/pledges/PLEDGE-ID/release'
  };
  if(!open)return;
  await submit(routes[open],open==='repay'?{amount:sample.loan,currency:'INR'}:open==='apply'?{property_id:sample.id,requested_amount:sample.loan,currency:'INR',pledge_id:'REQUIRES_BACKEND_ID'}:open==='approve'?{decision:'APPROVE'}:open==='reject'?{decision:'REJECT'}:{});
  setOpen(null);
 }
 return <><SectionHeading title={isLender?'Lender Console':'Loan Applications'} description="SIMULATED LENDING WORKFLOW — no real bank approval, funds transfer or loan contract."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="Indicative collateral" value={inr(2000000)} description="200 ANSH × ₹10,000 · illustrative"/><Metric label="Indicative loan request" value={inr(sample.loan)} description="Example from business rules"/><Metric label="Loan-to-value" value={sample.ltv+'%'} description="Configurable backend risk policy required"/></div>
 <div className="mt-5 grid gap-5 xl:grid-cols-2">
 <Card title="Financing application" description="Lender decisions are simulated; collateral restrictions require DRUNIX">
 <dl><DataRow label="Applicant" value="Aarav · Demo investor"/><DataRow label="Property" value={sample.name}/><DataRow label="Proposed pledge" value="200 ANSH"/><DataRow label="Investor owned units" value={integer(holding.owned)}/><DataRow label="Applicant loan request" value={inr(sample.loan)}/><DataRow label="Credit assessment" value="Not verified · simulated"/><DataRow label="Loan workflow" value={<Status value={eligible?'PREVIEW_ONLY':'DRAFT'}/>}/></dl>
 {eligible?<div className="mt-5 flex flex-wrap gap-2">{isLender?<><Button onClick={()=>setOpen('assess')}>Review assessment</Button><Button variant="secondary" onClick={()=>setOpen('approve')}>Review approval</Button><Button variant="secondary" onClick={()=>setOpen('reject')}>Review rejection</Button></>:<Button onClick={()=>setOpen('apply')}>Review loan application</Button>}</div>:<EmptyState title="No active loan application" description="Select the pledged preview scenario to display illustrative financing information."/>}
 </Card>
 <Card title="Disbursement, repayment and release" description="Partial collateral release is excluded from the MVP">
 <dl><DataRow label="Simulated loan principal" value={inr(sample.loan)}/><DataRow label="Outstanding before repayment" value={phase==='RELEASED'?inr(0):inr(sample.loan)}/><DataRow label="Repayment history" value={phase==='RELEASED'?'Full repayment scenario':'No verified repayment'}/><DataRow label="Collateral release" value={phase==='RELEASED'?'Illustrative release state':'Not confirmed'}/><DataRow label="DRUNIX release commit" value={<Status value="UNAVAILABLE"/>}/></dl>
 <div className="mt-5 flex flex-wrap gap-2">{isLender?<><Button variant="secondary" onClick={()=>setOpen('disburse')}>Review simulated disbursement</Button><Button variant="secondary" onClick={()=>setOpen('release')}>Review full release</Button></>:<Button onClick={()=>setOpen('repay')}>Review full repayment</Button>}</div>
 <p className="mt-4 text-xs leading-5 text-slate-500">Full repayment permits a release request. Units only become transferable again after confirmed DRUNIX release commitment.</p>
 </Card></div>
 <ReviewDialog open={open!==null} onOpenChange={v=>!v&&setOpen(null)} title="Review simulated financing operation" description="The loan service will provide real application IDs, policy decisions and payment simulation records. This preview does not disburse funds." onConfirm={confirm} busy={submitting} confirmLabel="Submit backend request">
 <dl><DataRow label="Action" value={open||'—'}/><DataRow label="Applicant" value="Aarav"/><DataRow label="Loan amount" value={inr(sample.loan)}/><DataRow label="Pledge quantity" value="200 ANSH"/><DataRow label="DRUNIX commitment" value="Not verified"/></dl></ReviewDialog>
 </>;
}
