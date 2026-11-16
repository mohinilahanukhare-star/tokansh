import {BarChart3,Building2,CheckCircle2,ChevronRight,FileClock,Landmark,PackageCheck,ShieldAlert,ShoppingCart,Wallet} from 'lucide-react';
import {Link} from 'react-router-dom';
import {CartesianGrid,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {useApp} from '../app/context';
import {phaseIndex,inr,integer,phases,sample} from '../demo/scenario';
import {Card,Metric,SectionHeading,EmptyState} from '../components/ui/card';
import {Status} from '../components/ui/status';
import {Button} from '../components/ui/button';
const trend=[{month:'Jun',value:95},{month:'Jul',value:96},{month:'Aug',value:97},{month:'Sep',value:98},{month:'Oct',value:99},{month:'Nov',value:100}];
function QuickLink({to,label}:{to:string;label:string}){return <Button asChild variant="secondary" size="sm"><Link to={to}>{label}<ChevronRight size={15}/></Link></Button>;}
export function Overview(){
 const {role,phase,property,holding,events}=useApp();
 const isIssuer=role==='ISSUER',isLender=role==='LENDER';
 return <><SectionHeading title={isIssuer?'Platform Overview':isLender?'Financing Overview':'Investor Dashboard'} description="Institutional visibility across asset records, ANSH lifecycle and portfolio activity." action={<QuickLink to={isIssuer?'/registry':isLender?'/lending':'/marketplace'} label={isIssuer?'Property registry':isLender?'Loan applications':'Explore ANSH'}/>}/>
 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  <Metric label="Illustrative property valuation" value={inr(sample.valuation,true)} description="Synthetic scenario · not a market valuation"/>
  <Metric label="Total ANSH issued" value={integer(property.issued)} description={'Approved supply '+integer(sample.approvedSupply)}/>
  <Metric label="Investor holdings" value={integer(holding.owned)+' ANSH'} description="Aarav · preview position"/>
  <Metric label="Pledged ANSH" value={integer(holding.pledged)} description="Transfer-restricted scenario"/>
 </div>
 <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
  <Card title="Indicative asset valuation" description="TechPark One · synthetic ₹ crore data · Jun–Nov 2026" action={<Status value="PREVIEW_ONLY"/>}>
   <div className="font-financial mb-4 text-2xl font-extrabold text-[#102B4E]">{inr(sample.valuation,true)}</div>
   <div className="h-52 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend} margin={{top:12,bottom:2,left:-24,right:8}}><CartesianGrid strokeDasharray="3 5" stroke="#e5ecf2"/><XAxis dataKey="month" fontSize={11} stroke="#718096"/><YAxis domain={[90,105]} tickFormatter={(v:number)=>'₹'+v} stroke="#718096" fontSize={11}/><Tooltip formatter={(v)=>[inr(Number(v)*10000000),'Illustrative value']}/><Line type="monotone" dataKey="value" stroke="#1769AA" strokeWidth={2.5} dot={{r:2}}/></LineChart></ResponsiveContainer></div>
  </Card>
  <Card title="Workflow coverage" description="Selected preview scenario · not live ledger progress">
   <div className="space-y-3">{phases.map((p,i)=><div key={p.id} className="flex items-center gap-3"><span className={'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold '+(i<=phaseIndex(phase)?'bg-blue-100 text-[#1769AA]':'bg-slate-100 text-slate-400')}>{i+1}</span><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-700">{p.label.split('. ')[1]}</p><p className="text-[11px] text-slate-500">{p.description}</p></div><span className="text-[10px] text-slate-400">{i<=phaseIndex(phase)?'Previewed':'Later'}</span></div>)}</div>
  </Card>
 </div>
 <div className="mt-5 grid gap-5 xl:grid-cols-2">
 <Card title="Business summary" description="Key figures for the approved jury scenario">
   <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><ShoppingCart size={17}/><span className="text-xs">Purchase scenario</span></div><p className="font-financial mt-2 text-lg font-bold text-[#102B4E]">500 ANSH</p><p className="mt-1 text-xs text-slate-500">{inr(5000000)} · illustrative</p></div>
    <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><Landmark size={17}/><span className="text-xs">Financing illustration</span></div><p className="font-financial mt-2 text-lg font-bold text-[#102B4E]">{inr(sample.loan)}</p><p className="mt-1 text-xs text-slate-500">60% LTV · simulated</p></div>
    <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><Wallet size={17}/><span className="text-xs">Available balance</span></div><p className="font-financial mt-2 text-lg font-bold text-[#102B4E]">{integer(holding.available)} ANSH</p><p className="mt-1 text-xs text-slate-500">Scenario position, not a ledger read</p></div>
    <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center gap-2 text-slate-500"><Building2 size={17}/><span className="text-xs">Properties in preview</span></div><p className="font-financial mt-2 text-lg font-bold text-[#102B4E]">1</p><p className="mt-1 text-xs text-slate-500">TechPark One · synthetic</p></div>
   </div>
 </Card>
 <Card title="Latest lifecycle activity" description="Preview-only events, without DRUNIX transaction identifiers" action={<QuickLink to="/transactions" label="All events"/>}>
  {events.length? <div className="divide-y divide-slate-100">{events.slice(0,4).map(e=><div key={e.id} className="flex items-start gap-3 py-3"><div className="mt-1 rounded-lg bg-slate-100 p-2 text-[#1769AA]"><FileClock size={16}/></div><div className="flex-1"><p className="text-xs font-semibold text-slate-700">{e.description}</p><p className="mt-1 text-[11px] text-slate-500">{e.actor} · {e.kind}</p></div><Status value="PREVIEW_ONLY"/></div>)}</div>:<EmptyState title="No events yet" description="Select another preview scenario to see illustrative lifecycle activity."/>}
 </Card>
 </div>
 </>;
}
export function Portfolio(){
 const {holding,phase,entitlement}=useApp();
 return <><SectionHeading title="Investor Portfolio" description="ANSH economic interests and separate external REIT examples; all values are illustrative."/>
 <div className="grid gap-4 md:grid-cols-3"><Metric label="ANSH owned" value={integer(holding.owned)} description="Not proof of legal land title"/><Metric label="Available ANSH" value={integer(holding.available)} description="Owned minus pledged"/><Metric label="Pledged ANSH" value={integer(holding.pledged)} description="Unavailable to transfer"/></div>
 <Card className="mt-5" title="ANSH position" description="Source: UI preview · freshness: no verified ledger snapshot">
  <div className="data-table-wrap"><table className="data-table w-full"><thead><tr><th>Asset</th><th className="money">Owned</th><th className="money">Available</th><th className="money">Pledged</th><th className="money">Acquisition value</th><th className="money">Illustrative value</th><th>Status</th></tr></thead><tbody><tr><td className="font-semibold">TechPark One</td><td className="money">{integer(holding.owned)}</td><td className="money">{integer(holding.available)}</td><td className="money">{integer(holding.pledged)}</td><td className="money">{inr(holding.acquisitionValue)}</td><td className="money">{inr(holding.indicativeValue)}</td><td><Status value="PREVIEW_ONLY"/></td></tr></tbody></table></div>
  <p className="mt-3 text-xs text-slate-500">Ownership projections must be refreshed from confirmed DRUNIX records. Selected scenario: {phase}.</p>
 </Card>
 <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card title="Income summary" description="Calculated only from a hypothetical record-date position">
  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-financial text-2xl font-bold text-[#102B4E]">{inr(entitlement.entitlement)}</p><Status value="PREVIEW_ONLY"/></div><p className="mt-3 text-xs text-slate-500">Eligible ANSH: {entitlement.eligibleUnits} of {integer(entitlement.totalUnits)} · illustrative distribution {inr(entitlement.totalAmount)}. Real entitlements require verified record-date ownership.</p>
 </Card><Card title="External REIT holdings" description="Separate legal instrument; not eligible for ANSH collateral"><div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-4"><div><p className="text-sm font-semibold text-slate-700">Illustrative Indian REIT</p><p className="mt-1 text-xs text-slate-500">External instrument · no connected custodian</p></div><Status value="PREVIEW_ONLY"/></div><p className="mt-3 text-xs text-slate-500">No live REIT trading, ledger custody or pledge is represented.</p></Card></div>
 </>;
}
