import {useState} from 'react';
import {Activity,AlertTriangle,BookOpen,FileClock,HandCoins,Info,Landmark,Layers3,ShieldAlert} from 'lucide-react';
import {Bar,BarChart,CartesianGrid,Cell,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {useApp} from '../app/context';
import {realBackendConfigured} from '../api/transport';
import {route} from '../api/contracts';
import {inr,integer,phaseIndex,sample} from '../demo/scenario';
import {Button} from '../components/ui/button';
import {Card,Metric,SectionHeading,EmptyState} from '../components/ui/card';
import {DataRow,Field} from '../components/ui/form';
import {ReviewDialog} from '../components/ui/dialog';
import {Status} from '../components/ui/status';
export function Distributions(){
 const {role,phase,entitlement,submit,submitting}=useApp();
 const [recordDate,setRecordDate]=useState(sample.recordDate),[amount,setAmount]=useState(sample.distribution),[open,setOpen]=useState(false);
 const eligible=phaseIndex(phase)>=3;
 const valid=!!recordDate&&Number(amount)>0&&Number.isFinite(Number(amount));
 const computed=valid?inr(Number(amount)*entitlement.eligibleUnits/100000):'—';
 return <><SectionHeading title="Rental Distributions" description="Declare income and calculate eligible entitlements using verified record-date ownership."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="Illustrative distribution" value={inr(sample.distribution)} description="Total declared amount"/><Metric label="Record-date ANSH · illustration" value={integer(entitlement.eligibleUnits)} description="Requires verified ledger snapshot"/><Metric label="Illustrative investor entitlement" value={inr(entitlement.entitlement)} description="500 / 100,000 × ₹10,00,000"/></div>
 <div className="mt-5 grid gap-5 xl:grid-cols-2">
 <Card title="Distribution declaration" description="Issuer workflow · calculation and simulated payment are separate">
 <form className="space-y-4" onSubmit={e=>{e.preventDefault();if(valid)setOpen(true);}}>
 <Field label="Property" id="dist-asset" value={sample.name} readOnly/>
 <Field label="Distribution period" id="dist-period" value={sample.distributionPeriod} readOnly/>
 <Field label="Record date" id="dist-date" type="date" value={recordDate} onChange={e=>setRecordDate(e.target.value)}/>
 <Field label="Total distributable amount (INR)" id="dist-amount" type="number" min={0.01} step={0.01} value={amount} onChange={e=>setAmount(e.target.value)}/>
 <dl><DataRow label="Eligible issued supply" value="100,000 ANSH · scenario"/><DataRow label="Illustrative entitlement" value={computed}/><DataRow label="Verified snapshot" value={<Status value="UNAVAILABLE"/>}/><DataRow label="Payment execution" value="Not performed"/></dl>
 {role==='ISSUER'&&<Button disabled={!valid||submitting} type="submit">Review distribution declaration</Button>}
 </form></Card>
 <Card title="Entitlement and payout records" description="Historical ledger snapshots are mandatory">
 <dl><DataRow label="Investor" value="Aarav"/><DataRow label="Record date" value={recordDate}/><DataRow label="Eligible holdings" value={integer(entitlement.eligibleUnits)+' ANSH (illustrative)'}/><DataRow label="Total eligible ANSH" value="100,000 (illustrative)"/><DataRow label="Illustrative entitlement" value={computed}/><DataRow label="Calculation status" value={<Status value="PREVIEW_ONLY"/>}/><DataRow label="Payment status" value={<Status value="UNAVAILABLE"/>}/></dl>
 <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><strong>Record-date rule:</strong> current holdings must not substitute for historical holdings. A verified DRUNIX snapshot or reconstruction is needed before a confirmed entitlement can be displayed.</div>
 {eligible&&<p className="mt-4 text-xs text-slate-500">Expected example: {integer(entitlement.eligibleUnits)} / 100,000 × {inr(sample.distribution)} = {inr(entitlement.entitlement)}.</p>}
 </Card></div>
 <ReviewDialog open={open} onOpenChange={setOpen} title="Review rental distribution" description="Backend must calculate allocations from confirmed record-date ownership. Payment simulation is a separate stage." onConfirm={async()=>{await submit(route.distributions,{property_id:sample.id,period:sample.distributionPeriod,record_date:recordDate,total_amount:amount,currency:'INR'});setOpen(false);}} busy={submitting} confirmLabel="Submit declaration"><dl><DataRow label="Property" value={sample.name}/><DataRow label="Record date" value={recordDate}/><DataRow label="Total" value={inr(amount)}/><DataRow label="Snapshot evidence" value="Not connected"/></dl></ReviewDialog>
 </>;
}
export function Audit({mode='audit'}:{mode?:'audit'|'transactions'}){
 const {events,phase}=useApp();
 return <><SectionHeading title={mode==='audit'?'Audit & Lifecycle':'Transactions'} description="Application events must remain distinct from verified blockchain transactions and ledger states."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="Illustrative lifecycle events" value={integer(events.length)} description="Selected preview scenario"/><Metric label="DRUNIX references verified" value="0" description="Backend gateway not connected"/><Metric label="Unreconciled ledger operations" value="Unknown" description="Requires status API"/></div>
 <Card className="mt-5" title={mode==='audit'?'Lifecycle activity':'Transaction history'} description="Preview event records are not real financial or blockchain transaction evidence">
 <div className="data-table-wrap"><table className="data-table w-full"><thead><tr><th>Operation reference</th><th>Event type</th><th>Asset</th><th>Actor</th><th>Application status</th><th>DRUNIX commit status</th><th>Ledger transaction ID</th><th>Time</th></tr></thead><tbody>
 {events.map(e=><tr key={e.id}><td className="font-mono text-xs">{e.id}</td><td className="font-semibold">{e.kind}</td><td>{sample.name}</td><td>{e.actor}</td><td><Status value="PREVIEW_ONLY"/></td><td><Status value="UNAVAILABLE"/></td><td>Not available</td><td>{e.time}</td></tr>)}
 </tbody></table></div>
 {!events.length&&<EmptyState title="No lifecycle activity" description="The backend will provide actual events after property registration."/>}
 </Card><div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-900"><strong>Transaction integrity:</strong> Submission, unknown outcome and reconciliation-required states are distinct from COMMITTED. This frontend does not fabricate a DRUNIX transaction ID. Current selected illustration: {phase}.</div>
 </>;
}
export function Intelligence(){
 const [occupancy,setOccupancy]=useState(94),[valuation,setValuation]=useState(100),[rental,setRental]=useState(8.2);
 const data=[{name:'Current',value:100},{name:'Scenario',value:valuation}];
 return <><SectionHeading title="Asset Intelligence" description="Explore illustrative property assumptions without implying guaranteed returns or verified valuations."/>
 <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
 <Card title="Scenario inputs" description="Synthetic analytics only, not a risk assessment">
  <div className="space-y-5"><Field id="intel-value" type="number" min={50} max={150} label="Illustrative valuation (₹ crore)" value={valuation} onChange={e=>setValuation(Number(e.target.value))}/><Field id="intel-occ" type="number" min={0} max={100} label="Occupancy assumption (%)" value={occupancy} onChange={e=>setOccupancy(Number(e.target.value))}/><Field id="intel-yield" type="number" min={0} max={30} step={0.1} label="Indicative rental yield (%)" value={rental} onChange={e=>setRental(Number(e.target.value))}/></div>
  <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-600"><strong>Assumptions:</strong> Scenario calculations are illustrative; they do not update approved collateral values, ledger holdings or actual payment entitlements.</div>
 </Card>
 <Card title="Valuation sensitivity" description="₹ crore · synthetic two-point comparison">
  <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{left:12,right:20,bottom:10,top:10}}><CartesianGrid stroke="#e5eaf0" strokeDasharray="3 5"/><XAxis type="number" domain={[0,Math.max(155,valuation+10)]} tickFormatter={(n:number)=>'₹'+n} fontSize={11}/><YAxis type="category" dataKey="name" width={70} fontSize={11}/><Tooltip formatter={(n)=>['₹'+String(n)+' crore','Illustrative valuation']}/><Bar dataKey="value" radius={[0,4,4,0]}><Cell fill="#607D9B"/><Cell fill="#1769AA"/></Bar></BarChart></ResponsiveContainer></div>
  <dl><DataRow label="Property" value={sample.name}/><DataRow label="Indicative scenario value" value={inr(Math.max(0,valuation)*10000000)}/><DataRow label="Occupancy" value={occupancy+'%'}/><DataRow label="Assumed annual yield" value={rental+'%'}/></dl>
 </Card></div>
 </>;
}
const components=['FastAPI','Application database','Go gateway','DRUNIX peers','Ordering service','Validation service','DRUNIX state database'];
export function System(){
 const {systemStatus,loadingStatus,backendReady}=useApp();
 const getStatus=(name:string)=>systemStatus?.components?.find(c=>c.name.toLowerCase()===name.toLowerCase())?.status||'UNAVAILABLE';
 return <><SectionHeading title="System Status" description="Operational transparency for the Python application and the DRUNIX network."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="Python backend" value={backendReady?'Responding':'Not connected'} description="HTTP availability is not ledger readiness"/><Metric label="DRUNIX evidence" value="Unverified" description="Verify individual transaction commitment"/><Metric label="Last successful ledger operation" value="Not available" description="Actual transaction reference required"/></div>
 <Card className="mt-5" title="Infrastructure components" description="No network secrets, certificates or internal topology details exposed">
  {loadingStatus&&<p role="status" className="mb-4 text-sm text-slate-500">Checking API status…</p>}
  <div className="data-table-wrap"><table className="data-table w-full"><thead><tr><th>Component</th><th>Observed status</th><th>Explanation</th></tr></thead><tbody>{components.map(name=><tr key={name}><td className="font-semibold">{name}</td><td><Status value={getStatus(name)}/></td><td>{getStatus(name)==='UNAVAILABLE'?'No verified integration status returned.':'Reported by Python system API'}</td></tr>)}</tbody></table></div>
 </Card><div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900"><div className="flex items-center gap-2 font-semibold"><Info size={18}/> Integration boundary</div><p className="mt-1 text-xs">The frontend checks <code>GET /api/v1/system/status</code> when a Python API URL is configured. A healthy FastAPI response does not imply DRUNIX ordering, endorsement or commit capability is operational.</p></div>
 </>;
}
