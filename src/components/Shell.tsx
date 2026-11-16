import {useState} from 'react';
import {NavLink,Outlet,useLocation} from 'react-router-dom';
import {Activity,BarChart3,BookOpen,Building2,ChevronDown,Compass,FileCheck2,FileClock,HandCoins,Landmark,LayoutDashboard,LogOut,Menu,Shield,ShieldAlert,ShoppingCart,Wallet,X} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import type {Role} from '../demo/scenario';
import {phases,roleOptions} from '../demo/scenario';
import {useApp} from '../app/context';
import {Status,PreviewWarning} from './ui/status';
type MenuItem={to:string;label:string;icon:LucideIcon;roles:Role[];section:string};
const nav:MenuItem[]=[
 {to:'/overview',label:'Dashboard',icon:LayoutDashboard,roles:['ISSUER','INVESTOR','LENDER'],section:'Overview'},
 {to:'/registry',label:'Property Registry',icon:Building2,roles:['ISSUER'],section:'Real Estate'},
 {to:'/issuance',label:'ANSH Issuance',icon:FileCheck2,roles:['ISSUER'],section:'Real Estate'},
 {to:'/marketplace',label:'Marketplace',icon:ShoppingCart,roles:['INVESTOR','ISSUER'],section:'Real Estate'},
 {to:'/portfolio',label:'My Portfolio',icon:Wallet,roles:['INVESTOR'],section:'Portfolio'},
 {to:'/transactions',label:'Transactions',icon:FileClock,roles:['INVESTOR','ISSUER','LENDER'],section:'Portfolio'},
 {to:'/intelligence',label:'Asset Intelligence',icon:BarChart3,roles:['INVESTOR','ISSUER'],section:'Portfolio'},
 {to:'/collateral',label:'Collateral Management',icon:Shield,roles:['INVESTOR','LENDER'],section:'Financing'},
 {to:'/lending',label:'Loan Applications',icon:Landmark,roles:['INVESTOR','LENDER'],section:'Financing'},
 {to:'/distributions',label:'Rental Distributions',icon:HandCoins,roles:['ISSUER','INVESTOR'],section:'Income'},
 {to:'/audit',label:'Audit & Lifecycle',icon:BookOpen,roles:['ISSUER','LENDER'],section:'Administration'},
 {to:'/system',label:'System Status',icon:Activity,roles:['ISSUER','INVESTOR','LENDER'],section:'Administration'}
];
export function Shell(){
 const {role,setRole,phase,setPhase,message,notify,backendReady}=useApp();
 const [open,setOpen]=useState(false);
 const [collapsed,setCollapsed]=useState(false);
 const location=useLocation();
 const items=nav.filter(item=>item.roles.includes(role));
 const title=nav.find(item=>item.to===location.pathname)?.label||'TokANSH Workspace';
 let current='';
 return <div className="flex min-h-screen bg-[#F4F6F9]">
  {open&&<button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
  <aside className={'fixed inset-y-0 left-0 z-40 flex flex-col bg-[#102B4E] text-white transition-all lg:sticky lg:top-0 lg:h-screen '+(open?'translate-x-0':'-translate-x-full lg:translate-x-0')+' '+(collapsed?'w-20':'w-64')}>
   <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
    <NavLink to="/overview" className="flex items-center gap-2 text-lg font-extrabold tracking-tight" onClick={()=>setOpen(false)}><span className="rounded-lg border border-blue-300/40 bg-blue-400/15 p-1.5 text-blue-200">◈</span>{!collapsed&&<span>Tok<span className="text-blue-200">ANSH</span></span>}</NavLink>
    <button className="text-blue-200 lg:hidden" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={20}/></button>
   </div>
   <div className="overflow-y-auto px-3 py-5">
    {!collapsed&&<p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-blue-200/70">Institutional Workspace</p>}
    {items.map(item=>{
      const section=item.section!==current;current=item.section;const Icon=item.icon;
      return <div key={item.to}>{section&&!collapsed&&<p className="mb-2 mt-5 px-3 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">{item.section}</p>}
      <NavLink to={item.to} onClick={()=>setOpen(false)} className={({isActive})=>'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium '+(isActive?'bg-[#1769AA] text-white':'text-blue-100/80 hover:bg-white/10 hover:text-white')} title={collapsed?item.label:undefined}><Icon className="shrink-0" size={18}/>{!collapsed&&item.label}</NavLink></div>;
    })}
   </div>
   <div className="mt-auto border-t border-white/10 p-3">
    {!collapsed&&<div className="mb-3 rounded-lg border border-blue-200/20 bg-white/5 p-3"><div className="flex items-center gap-2 text-xs font-bold text-blue-100"><ShieldAlert size={15}/> Preview mode</div><p className="mt-1 text-[11px] leading-5 text-blue-100/70">Backend and DRUNIX evidence unavailable. No real ANSH state changes.</p></div>}
    <button className="hidden w-full items-center justify-center rounded-lg py-2 text-blue-100 hover:bg-white/10 lg:flex" onClick={()=>setCollapsed(x=>!x)} aria-label={collapsed?'Expand sidebar':'Collapse sidebar'}><ChevronDown className={collapsed?'rotate-90':'-rotate-90'} size={16}/></button>
   </div>
  </aside>
  <div className="min-w-0 flex-1">
   <header className="sticky top-0 z-20 flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:px-8">
    <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-[#102B4E] lg:hidden" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={22}/></button><div><p className="text-[10px] uppercase tracking-[.1em] text-slate-400">TokANSH / {role==='ISSUER'?'Issuer':role==='INVESTOR'?'Investor':'Lender'}</p><strong className="text-sm text-[#102B4E]">{title}</strong></div></div>
    <div className="flex flex-wrap items-center gap-2.5">
     <Status value={backendReady?'PENDING':'UNAVAILABLE'}/>
     <label className="flex items-center gap-1.5 text-xs text-slate-500">Role <select aria-label="Switch demonstration role" className="rounded-md border border-slate-200 bg-white px-2 py-1.5 font-semibold text-[#102B4E]" value={role} onChange={e=>setRole(e.target.value as Role)}>{roleOptions.map(x=><option key={x.role} value={x.role}>{x.label}</option>)}</select></label>
     <label className="flex items-center gap-1.5 text-xs text-slate-500">Scenario <select aria-label="Preview scenario stage" className="max-w-[175px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-[#102B4E]" value={phase} onChange={e=>setPhase(e.target.value as typeof phase)}>{phases.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
    </div>
   </header>
   <main className="mx-auto max-w-[1550px] px-4 py-6 md:px-8">
    <PreviewWarning compact/>
    {message&&<div role="status" className={'mt-4 flex justify-between gap-3 rounded-lg border p-3 text-sm '+(message.kind==='error'?'border-red-200 bg-red-50 text-red-800':'border-blue-200 bg-blue-50 text-blue-900')}><span>{message.text}</span><button onClick={()=>notify(null)} aria-label="Dismiss notification"><X size={16}/></button></div>}
    <div className="page-enter mt-6"><Outlet/></div>
    <footer className="mt-9 flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-400"><span>TokANSH · DRUNIX Hackathon 2026</span><span>UI preview only · No actual property title, payment or DRUNIX commitment</span></footer>
   </main>
  </div>
 </div>;
}
