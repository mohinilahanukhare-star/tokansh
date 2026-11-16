import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowLeftRight, ArrowRight,
  ArrowUpRight, BadgeCheck, Bell, Building2, CalendarDays, Check,
  CheckCircle2, ChevronRight, CircleHelp, Compass, FileClock, Filter,
  HandCoins, Home, Info, Landmark, LayoutDashboard, LockKeyhole, LogOut,
  Menu, Plus, RefreshCw, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, TrendingUp, Users, Wallet, X
} from 'lucide-react';
import {
  ASSETS, DEMO_ACCOUNTS, INR, applyShock, availableUnits, decidePledge,
  effectivePrice, getDemoState, initialState, issueAnsh, placeTrade,
  pledgedUnits, recordDistribution, releasePledge, repayPledge,
  requestPledge, retryTrade, saveDemoState, timeLabel
} from './mock/engine';
import type { Asset, DemoState, Role } from './mock/engine';
import { API_MODE } from './api/client';

type Page = 'dashboard' | 'explore' | 'property' | 'portfolio' | 'trading' |
  'collateral' | 'manager' | 'lender' | 'audit' | 'intelligence';
type Notice = { message: string; kind: 'success' | 'error' | 'info' } | null;
const menus: Record<Role, { id: Page; label: string; Icon: typeof Home }[]> = {
  INVESTOR: [
    {id:'dashboard',label:'Overview',Icon:LayoutDashboard},
    {id:'explore',label:'Explore Properties',Icon:Compass},
    {id:'portfolio',label:'My Portfolio',Icon:Wallet},
    {id:'trading',label:'Trade & Transfer',Icon:ArrowLeftRight},
    {id:'collateral',label:'Collateral & Loans',Icon:Landmark},
    {id:'audit',label:'Transactions & Audit',Icon:FileClock},
    {id:'intelligence',label:'Intelligence',Icon:Sparkles}
  ],
  ASSET_MANAGER: [
    {id:'manager',label:'Asset Management',Icon:Building2},
    {id:'explore',label:'Explore Assets',Icon:Compass},
    {id:'audit',label:'Transactions & Audit',Icon:FileClock}
  ],
  LENDER: [
    {id:'lender',label:'Lender Dashboard',Icon:Landmark},
    {id:'audit',label:'Transactions & Audit',Icon:FileClock}
  ],
  ADMIN: [
    {id:'dashboard',label:'Demo Overview',Icon:LayoutDashboard},
    {id:'manager',label:'Asset Management',Icon:Building2},
    {id:'lender',label:'Lender Dashboard',Icon:Landmark},
    {id:'audit',label:'Transactions & Audit',Icon:FileClock}
  ]
};
const roleLabels: Record<Role,string> = {INVESTOR:'Investor',ASSET_MANAGER:'Asset manager',LENDER:'Institutional lender',ADMIN:'Demo administrator'};
const titles: Record<Page,string> = {dashboard:'Investor Overview',explore:'Explore Properties',property:'Property Details',portfolio:'My Portfolio',trading:'Trade & Transfer',collateral:'Collateral & Loans',manager:'Asset Management',lender:'Lender Dashboard',audit:'Transactions & Audit',intelligence:'Intelligence Studio'};
const isRole = (value:string):value is Role => value==='INVESTOR'||value==='ASSET_MANAGER'||value==='LENDER'||value==='ADMIN';

function Panel({children,className=''}:{children:ReactNode;className?:string}){return <div className={'panel '+className}>{children}</div>;}
function Status({value}:{value:string}){
  const positive=['ACTIVE','COMMITTED','CONFIRMED','RELEASED','RECORDED','SIMULATED_PAYOUT'].includes(value);
  const negative=['REJECTED','PAYMENT_FAILED','FAILED'].includes(value);
  return <span className={'status '+(positive?'positive':negative?'negative':'pending')}>{positive?<Check size={12}/>:negative?<X size={12}/>:<span className="dot"/>}{value.replaceAll('_',' ')}</span>;
}
function Source({label='SIMULATED'}:{label?:string}){return <span className="source"><span className="dot"/>{label==='SIMULATED'?'Synthetic demo':label}</span>;}
function Btn({children,onClick,type='button',secondary=false,disabled=false}:{children:ReactNode;onClick?:()=>void;type?:'button'|'submit';secondary?:boolean;disabled?:boolean}){
  return <button className={'btn '+(secondary?'outline':'solid')} type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}
function Heading({title,desc,actions}:{title:string;desc?:string;actions?:ReactNode}){return <div className="heading"><div><div className="eyebrow">TOKANSH / DEMO WORKSPACE</div><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{actions&&<div className="heading-actions">{actions}</div>}</div>;}
function Metric({title,value,Icon,sub}:{title:string;value:string;Icon:typeof Home;sub:string}){return <Panel className="metric"><div className="metric-top"><span>{title}</span><Icon size={20}/></div><strong>{value}</strong><small>{sub}</small></Panel>;}
function Empty({title,desc}:{title:string;desc:string}){return <div className="empty"><Info size={28}/><h3>{title}</h3><p>{desc}</p></div>;}
function Chart({shock}:{shock:number}){
  const base=[55,60,59,62,69,66,72,74,71,78,80,83,86,88,90,94,93,98,102,106+shock*.4];
  const points=base.map((v,i)=>String(i*33)+','+String(170-v)).join(' ');
  return <div className="chart"><svg viewBox="0 0 628 170" role="img" aria-label="Illustrative investment performance trend">
    <defs><linearGradient id="chartgrad" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0d9c83" stopOpacity=".26"/><stop offset="1" stopColor="#0d9c83" stopOpacity="0"/></linearGradient></defs>
    {[35,80,125].map(y=><line key={y} x1="0" x2="628" y1={y} y2={y} stroke="#dce7ea" strokeDasharray="4 6"/>)}
    <polygon points={'0,166 '+points+' 627,166'} fill="url(#chartgrad)"/>
    <polyline points={points} fill="none" stroke="#079c84" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg><div className="chart-months"><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span></div></div>;
}
function ActivityList({state,limit=5}:{state:DemoState;limit?:number}){return <div className="activity">{state.events.slice(0,limit).map(item=><div className="activity-row" key={item.id}>
  <div className="activity-icon"><Activity size={16}/></div><div className="grow"><strong>{item.text}</strong><small>{timeLabel(item.time)} · {item.actor} · {item.kind}</small></div><Status value={item.status}/></div>)}</div>;}
function PropertyCard({asset,onOpen}:{asset:Asset;onOpen:()=>void}){return <Panel className="property-card">
  <div className="property-photo" style={{backgroundImage:'linear-gradient(180deg, transparent 48%,rgba(8,30,50,.4)),url("'+asset.image+'")'}}>
    <span className="photo-badge">{asset.status==='ACTIVE'?'Open for demo investment':'Coming soon'}</span></div>
  <div className="property-body"><small>{asset.city}</small><h3>{asset.name}</h3><p>{asset.subtitle}</p>
    <div className="property-stats"><div><small>Indicative valuation</small><strong>{INR(asset.valuation,true)}</strong></div><div><small>ANSH price</small><strong>{INR(asset.unitPrice)}</strong></div></div>
    <div className="property-footer"><span><Building2 size={15}/> {asset.kind}</span><button onClick={onOpen} className="link-button">View asset <ArrowRight size={15}/></button></div>
  </div>
</Panel>;}
export default function App(){
  const [role,setRole]=useState<Role|null>(null);
  const [selectedRole,setSelectedRole]=useState<Role>('INVESTOR');
  const [page,setPage]=useState<Page>('dashboard');
  const [state,setState]=useState<DemoState>(()=>getDemoState());
  const [notice,setNotice]=useState<Notice>(null);
  const [mobile,setMobile]=useState(false);
  const [assetId,setAssetId]=useState('techpark_one');
  const [filter,setFilter]=useState('');
  const [side,setSide]=useState<'BUY'|'SELL'>('BUY');
  const [units,setUnits]=useState(25);
  const [failPayment,setFailPayment]=useState(true);
  const [pledgeInput,setPledgeInput]=useState(100);
  const [issuanceInput,setIssuanceInput]=useState(2000);
  const [distributionValue,setDistributionValue]=useState(10);
  const [distributionDate,setDistributionDate]=useState('2026-11-30');
  const [shock,setShock]=useState(-12);
  const [occupancy,setOccupancy]=useState(85);
  const [managerTab,setManagerTab]=useState<'overview'|'issue'|'income'>('overview');
  const [lenderTab,setLenderTab]=useState<'applications'|'risk'>('applications');
  const asset=ASSETS.find(a=>a.id===assetId)||ASSETS[0];
  const available=availableUnits(state);
  const pledged=pledgedUnits(state);
  const totalValue=state.ownedUnits*effectivePrice(state);
  const activePledges=state.pledges.filter(p=>p.status==='ACTIVE'||p.status==='REPAID');
  const pendingPledges=state.pledges.filter(p=>p.status==='REQUESTED');

  useEffect(()=>{try{const saved=sessionStorage.getItem('tokansh-role');if(saved&&isRole(saved)){setRole(saved);setPage(saved==='ASSET_MANAGER'?'manager':saved==='LENDER'?'lender':'dashboard');}}catch{/* private session */}},[]);
  useEffect(()=>{saveDemoState(state);},[state]);
  useEffect(()=>{if(notice){const timer=setTimeout(()=>setNotice(null),6000);return ()=>clearTimeout(timer);}},[notice]);
  function navigate(next:Page){setPage(next);setMobile(false);window.location.hash='#/'+next;window.scrollTo(0,0);}
  function signIn(next:Role){setRole(next);try{sessionStorage.setItem('tokansh-role',next);}catch{/* storage optional */}navigate(next==='ASSET_MANAGER'?'manager':next==='LENDER'?'lender':'dashboard');}
  function logOut(){setRole(null);try{sessionStorage.removeItem('tokansh-role');}catch{/* optional */}window.location.hash='';}
  function changeState(action:(s:DemoState)=>DemoState,success:string){
    try{const next=action(state);setState(next);setNotice({message:success,kind:'success'});}
    catch(e){setNotice({message:e instanceof Error?e.message:'The action could not be completed',kind:'error'});}
  }
  function doTrade(){
    try{const updated=placeTrade(state,side,units,failPayment);setState(updated);setNotice({kind:failPayment?'info':'success',message:failPayment?'Simulated payment failed. Units were not changed; use Retry in the trade history.':'Demo settlement recorded and balance updated.'});}
    catch(e){setNotice({kind:'error',message:e instanceof Error?e.message:'Trade was rejected'});}
  }
  const tabs=role?menus[role]:[];
  const allowedPage=role?(tabs.some(x=>x.id===page)||page==='property'):false;
  const visible=allowedPage?page:(tabs[0]?.id||'dashboard');
  const balances=[{key:'owned',name:'Owned ANSH',count:state.ownedUnits},{key:'available',name:'Available to trade',count:available},{key:'pledged',name:'Locked / pledged',count:pledged}];
  const filteredAssets=useMemo(()=>ASSETS.filter(a=>(a.name+' '+a.city+' '+a.kind).toLowerCase().includes(filter.toLowerCase())),[filter]);
  if(!role) return <div className="login-page"><div className="login-side">
    <div className="brand large"><span className="logo-symbol">◈</span><span>Tok<span className="brand-accent">ANSH</span></span></div>
    <div className="login-pitch"><span className="eyebrow">DRUNIX HACKATHON 2026</span><h1>Real estate,<br/>reimagined for <em>everyone.</em></h1><p>Explore fractional real estate, manage ANSH interests, and experience programmable ownership lifecycles.</p>
    <div className="login-features"><span><ShieldCheck size={18}/> Permissioned asset records</span><span><ArrowLeftRight size={18}/> Transparent transfers</span><span><Landmark size={18}/> Connected financing workflows</span></div></div>
    <div className="login-foot">Illustrative hackathon prototype · No real investments or bank payments</div></div>
    <div className="login-main"><Panel className="login-card"><span className="login-lock"><LockKeyhole size={23}/></span><div className="eyebrow">WELCOME TO TOKANSH</div><h2>Sign in to your workspace</h2><p>Choose a demo account to explore a role-specific experience.</p>
      <div className="field"><label htmlFor="account">Demo account</label><select id="account" value={selectedRole} onChange={e=>setSelectedRole(e.target.value as Role)}>{DEMO_ACCOUNTS.map(a=><option key={a.role} value={a.role}>{a.label}</option>)}</select></div>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" value={DEMO_ACCOUNTS.find(a=>a.role===selectedRole)?.email||''} readOnly/></div>
      <div className="field"><label htmlFor="password">Demo password</label><input id="password" type="password" readOnly value="tokansh-demo"/></div>
      <Btn onClick={()=>signIn(selectedRole)}>Enter demo workspace <ArrowRight size={17}/></Btn>
      <div className="login-disclaimer"><Info size={15}/> This demo uses browser-local role switching, not real authentication. Backend role authorization will be required for production.</div>
    </Panel></div>
  </div>;
  return <div className="app">
    <aside className={'sidebar '+(mobile?'sidebar-open':'')}><div className="sidebar-top"><button className="brand" onClick={()=>navigate(tabs[0]?.id||'dashboard')}><span className="logo-symbol">◈</span><span>Tok<span className="brand-accent">ANSH</span></span></button><button className="mobile-close" onClick={()=>setMobile(false)}><X size={20}/></button></div>
      <div className="workspace-label">WORKSPACE <span className="live-pulse"/></div>
      <div className="workspace-card"><div className="workspace-avatar">{role==='INVESTOR'?'A':role==='ASSET_MANAGER'?'M':role==='LENDER'?'L':'D'}</div><div><strong>{roleLabels[role]}</strong><small>Demo environment</small></div><ChevronRight size={16}/></div>
      <div className="nav-heading">MENU</div><nav className="side-nav">{tabs.map(item=><button key={item.id} className={'nav-link '+(visible===item.id?'active':'')} onClick={()=>navigate(item.id)}><item.Icon size={18}/><span>{item.label}</span>{visible===item.id&&<span className="active-marker"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-notice"><ShieldCheck size={20}/><strong>DRUNIX-ready design</strong><small>Ledger connection pending. All balances here are synthetic.</small></div><button className="nav-link logout" onClick={logOut}><LogOut size={18}/> Switch demo account</button></div>
    </aside>
    {mobile&&<button className="mobile-shade" aria-label="Close menu" onClick={()=>setMobile(false)}/>}
    <main className="main"><header className="topbar"><div className="top-left"><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu size={23}/></button><span className="breadcrumb">TokANSH <ChevronRight size={15}/> <strong>{titles[visible]}</strong></span></div><div className="top-actions"><span className="top-date"><CalendarDays size={15}/> {new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span><Source/><button className="icon-button" title="Demo status" onClick={()=>setNotice({kind:'info',message:'This frontend currently uses mock data. No real blockchain or bank service is connected.'})}><Bell size={19}/></button><button className="user-pill" onClick={logOut} title="Switch role">{role.slice(0,1)}</button></div></header>
      <div className="content">
      {notice&&<div className={'toast '+notice.kind} role="status"><Info size={17}/><span>{notice.message}</span><button onClick={()=>setNotice(null)}><X size={16}/></button></div>}
      {API_MODE==='real'&&<div className="banner warning"><Info size={16}/> API mode is configured as real, but interactive screens still use the mock adapter until Python APIs are connected.</div>}
      {visible==='dashboard'&&<><Heading title={role==='ADMIN'?'TokANSH Demo Overview':'Welcome back, Aarav'} desc="A complete view of your fractional real-estate journey."><Btn onClick={()=>navigate('explore')}>Explore properties <ArrowUpRight size={17}/></Btn></Heading>
        <div className="hero"><div><span className="hero-tag"><span className="live-pulse"/> YOUR REAL ESTATE, UNLOCKED</span><h2>Wealth built, <em>one Ansh at a time.</em></h2><p>Discover more ways to invest, earn income, and access value from your fractional interests.</p><button onClick={()=>navigate('explore')} className="hero-link">Discover opportunities <ArrowRight size={16}/></button></div><div className="hero-graphic"><div className="orbit a"/><div className="orbit b"/><div className="hero-icon"><Building2 size={58}/></div><div className="hero-float"><TrendingUp size={15}/> Portfolio insights</div></div></div>
        <div className="metrics four"><Metric title="Portfolio value" value={INR(totalValue,true)} Icon={Wallet} sub="Indicative mark-to-model"/><Metric title="Total ANSH units" value={state.ownedUnits.toLocaleString('en-IN')} Icon={Building2} sub="Synthetic ownership record"/><Metric title="Pledged units" value={pledged.toLocaleString('en-IN')} Icon={LockKeyhole} sub="Unavailable for transfer"/><Metric title="Distribution events" value={String(state.distributions.length)} Icon={HandCoins} sub="Simulated income servicing"/></div>
        <div className="two-col major"><Panel className="performance"><div className="panel-heading"><div><h3>Portfolio performance</h3><p>Indicative portfolio trend</p></div><span className="mini-select">Last 6 months</span></div><div className="chart-value">{INR(totalValue,true)} <span><TrendingUp size={13}/> Demo only</span></div><Chart shock={state.valuationShock}/></Panel>
          <Panel><div className="panel-heading"><div><h3>Asset allocation</h3><p>Instrument exposure</p></div></div><div className="allocation"><div className="donut"><div><strong>ANSH</strong><small>+ REITs</small></div></div><div className="legend"><span><i className="swatch teal"/> ANSH interests <b>99.8%</b></span><span><i className="swatch blue"/> External REIT demo <b>0.2%</b></span></div></div></Panel></div>
        <div className="two-col bottom-grid"><Panel><div className="panel-heading"><div><h3>Your featured property</h3><p>A closer look at your holdings</p></div><button className="link-button" onClick={()=>navigate('portfolio')}>My portfolio <ArrowRight size={15}/></button></div><div className="featured-row"><img alt="Commercial office interior" src={ASSETS[0].image}/><div><h4>TechPark One</h4><p>Bengaluru · Commercial Office</p><div className="featured-amount">{state.ownedUnits.toLocaleString('en-IN')} ANSH</div><Source/></div></div></Panel><Panel><div className="panel-heading"><div><h3>Recent activity</h3><p>Your latest lifecycle events</p></div><button className="link-button" onClick={()=>navigate('audit')}>View audit <ArrowRight size={15}/></button></div><ActivityList state={state} limit={3}/></Panel></div>
      </>}
      {visible==='explore'&&<><Heading title="Explore Properties" desc="Discover fractional real-estate opportunities and review each asset's rights, terms and risks."/ >
        <div className="search-row"><div className="searchbox"><Search size={19}/><input placeholder="Search by asset, location or category" value={filter} onChange={e=>setFilter(e.target.value)}/></div><div className="filter-pill"><SlidersHorizontal size={17}/> All property types</div></div>
        <div className="summary-text">{filteredAssets.length} properties · Indicative information · Opportunities are synthetic</div>
        <div className="property-grid">{filteredAssets.map(a=><PropertyCard key={a.id} asset={a} onOpen={()=>{setAssetId(a.id);navigate('property');}}/>)}</div>
        {filteredAssets.length===0&&<Empty title="No matching assets" desc="Try a different search term."/>}
      </>}
      {visible==='property'&&<><Heading title={asset.name} desc={asset.subtitle} actions={<Btn secondary onClick={()=>navigate('explore')}><ArrowLeft size={16}/> All properties</Btn>}/>
        <div className="property-detail-hero"><img src={asset.image} alt={asset.name}/><div className="property-cover"><span>{asset.city}</span><h2>{asset.name}</h2><Source/></div></div>
        <div className="metrics four"><Metric title="Asset valuation" value={INR(asset.valuation,true)} Icon={Building2} sub="Indicative · synthetic"/><Metric title="Price / ANSH" value={INR(asset.unitPrice)} Icon={Wallet} sub="Demo unit price"/><Metric title="Indicative yield" value={asset.yieldPct+'%'} Icon={TrendingUp} sub="Not a guaranteed return"/><Metric title="Occupancy" value={asset.occupancy+'%'} Icon={Users} sub="Illustrative property data"/></div>
        <div className="two-col major"><Panel><h3>Investment overview</h3><p className="body-copy">{asset.description}</p><div className="detail-list"><div><span>Property type</span><strong>{asset.kind}</strong></div><div><span>Location</span><strong>{asset.city}</strong></div><div><span>Property size</span><strong>{asset.size}</strong></div><div><span>Total authorized ANSH</span><strong>{state.maxUnits.toLocaleString('en-IN')}</strong></div><div><span>Current issued ANSH</span><strong>{state.issuedUnits.toLocaleString('en-IN')}</strong></div></div></Panel>
        <Panel><h3>Rights & participation</h3><p className="body-copy">{asset.rights}</p><div className="notice-box"><ShieldCheck size={19}/> Transfers and restrictions are intended to be validated by the Python backend against DRUNIX. This frontend is currently a synthetic simulation.</div><div className="button-row"><Btn disabled={asset.status!=='ACTIVE'} onClick={()=>navigate('trading')}>Review demo investment <ArrowRight size={16}/></Btn><Btn secondary onClick={()=>setNotice({kind:'info',message:'Asset factsheet is synthetic; no verified legal document is available.'})}>View disclosure</Btn></div></Panel></div>
      </>}
      {visible==='portfolio'&&<><Heading title="My Portfolio" desc="Track ANSH interests and external REIT examples without mixing legal ownership rights." actions={<Btn secondary onClick={()=>navigate('explore')}><Plus size={17}/> Explore more</Btn>}/>
        <div className="metrics three"><Metric title="Total illustrative value" value={INR(totalValue+100000,true)} Icon={Wallet} sub="ANSH + external REIT demo"/><Metric title="Available ANSH" value={available.toLocaleString('en-IN')} Icon={CheckCircle2} sub="Transferable demo units"/><Metric title="Locked ANSH" value={pledged.toLocaleString('en-IN')} Icon={LockKeyhole} sub="Cannot be transferred"/></div>
        <Panel><div className="panel-heading"><div><h3>ANSH holdings</h3><p>Platform-controlled fractional economic interests</p></div><Source/></div>
          <div className="table-wrap"><table><thead><tr><th>Asset</th><th>Total owned</th><th>Available</th><th>Pledged</th><th>Indicative value</th><th>Source</th></tr></thead>
          <tbody><tr><td className="strong">TechPark One</td><td>{state.ownedUnits.toLocaleString('en-IN')}</td><td>{available.toLocaleString('en-IN')}</td><td>{pledged.toLocaleString('en-IN')}</td><td>{INR(totalValue)}</td><td><Source/></td></tr></tbody></table></div>
          <div className="panel-bottom"><Btn onClick={()=>navigate('trading')}>Trade ANSH <ArrowRight size={16}/></Btn><Btn secondary onClick={()=>navigate('collateral')}>Manage collateral</Btn></div></Panel>
        <Panel><div className="panel-heading"><div><h3>External REIT holdings</h3><p>Separate instrument, indicative value and different legal rights</p></div><Source/></div>
          <div className="table-wrap"><table><thead><tr><th>Instrument</th><th>Units</th><th>Indicative value</th><th>Custody</th><th>Status</th></tr></thead><tbody><tr><td className="strong">Illustrative Indian REIT</td><td>40</td><td>{INR(100000)}</td><td>External / synthetic</td><td><Status value="SIMULATED_PAYOUT"/></td></tr></tbody></table></div>
          <p className="footnote">REIT examples cannot be traded or pledged through TokANSH. They are not DRUNIX-issued tokens.</p></Panel>
      </>}
      {visible==='trading'&&<><Heading title="Trade & Transfer" desc="A guided workflow for simulated payments and restriction-aware ownership changes."/>
        <div className="two-col major"><Panel><h3>New ANSH trade</h3><p className="panel-intro">TechPark One · Synthetic direct trade</p>
          <div className="segmented"><button className={side==='BUY'?'selected':''} onClick={()=>setSide('BUY')}>Buy</button><button className={side==='SELL'?'selected':''} onClick={()=>setSide('SELL')}>Sell</button></div>
          <div className="field"><label>Asset</label><div className="readonly-field">TechPark One <span>ANSH</span></div></div>
          <div className="field"><label htmlFor="quantity">ANSH quantity</label><input id="quantity" type="number" min={1} step={1} value={units} onChange={e=>setUnits(Number(e.target.value))}/></div>
          <div className="quote"><div><span>Unit price</span><strong>{INR(ASSETS[0].unitPrice)}</strong></div><div><span>Order total</span><strong>{INR(units*ASSETS[0].unitPrice)}</strong></div><div><span>Available to sell</span><strong>{available.toLocaleString('en-IN')} ANSH</strong></div></div>
          <label className="checkline"><input type="checkbox" checked={failPayment} onChange={e=>setFailPayment(e.target.checked)}/> Simulate payment failure (demo)</label>
          <Btn onClick={doTrade}>{side==='BUY'?'Place demo buy':'Place demo sell'} <ArrowRight size={16}/></Btn>
          <p className="footnote">No payment is charged. This is a browser-only synthetic trade flow; no actual DRUNIX transaction is submitted.</p>
        </Panel><Panel><div className="panel-heading"><div><h3>Settlement lifecycle</h3><p>Required backend integration states</p></div></div>
          <div className="steps">{[['1','Validate eligibility','Confirm holdings and permissions'],['2','Payment outcome','Failure or confirmation'],['3','Submit ledger operation','DRUNIX transaction pending'],['4','Confirm finality','COMMITTED or REJECTED'],['5','Refresh holdings','Only after authoritative commit']].map(([n,t,desc])=><div className="step" key={n}><div className="step-num">{n}</div><div><strong>{t}</strong><small>{desc}</small></div></div>)}</div>
          <div className="notice-box"><Info size={17}/> The mock action updates a local synthetic registry. A real payment response is not proof of ledger commitment.</div>
        </Panel></div>
        <Panel><div className="panel-heading"><div><h3>Trade history</h3><p>Use Retry on failed demo payments</p></div></div><div className="table-wrap"><table><thead><tr><th>Reference</th><th>Type</th><th>Units</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{state.trades.map(t=><tr key={t.id}><td className="mono">{t.id}</td><td>{t.side}</td><td>{t.units}</td><td>{INR(t.amount)}</td><td><Status value={t.status}/></td><td>{t.status==='PAYMENT_FAILED'?<button className="link-button" onClick={()=>changeState(s=>retryTrade(s,t.id),'Simulated payment retry succeeded; synthetic balance updated exactly once.')}>Retry <RefreshCw size={14}/></button>:<span className="muted">—</span>}</td></tr>)}</tbody></table></div></Panel>
      </>}
      {visible==='collateral'&&<><Heading title="Collateral & Loans" desc="Unlock potential liquidity while preserving transfer restrictions and auditable pledge lifecycles."/>
        <div className="metrics three"><Metric title="Available for pledge" value={available.toLocaleString('en-IN')} Icon={Wallet} sub="Unlocked ANSH units"/><Metric title="Active collateral" value={pledged.toLocaleString('en-IN')} Icon={LockKeyhole} sub="Non-transferable units"/><Metric title="Indicative pledge value" value={INR(pledged*effectivePrice(state)*.65,true)} Icon={Landmark} sub="Demo collateral ratio"/></div>
        <div className="two-col major"><Panel><h3>Request ANSH-backed financing</h3><p className="panel-intro">Illustrative 65% loan-to-value assumption</p>
          <div className="field"><label>Property</label><div className="readonly-field">TechPark One</div></div>
          <div className="field"><label htmlFor="pledge-units">Units to pledge</label><input id="pledge-units" type="number" min={1} max={available} step={1} value={pledgeInput} onChange={e=>setPledgeInput(Number(e.target.value))}/></div>
          <div className="quote"><div><span>Eligible ANSH</span><strong>{available.toLocaleString('en-IN')}</strong></div><div><span>Indicative collateral</span><strong>{INR(pledgeInput*effectivePrice(state))}</strong></div><div><span>Potential borrowing</span><strong>{INR(pledgeInput*effectivePrice(state)*.65)}</strong></div></div>
          <Btn onClick={()=>changeState(s=>requestPledge(s,pledgeInput),'Collateral request submitted to the demo lender.')}>Submit pledge request <ArrowRight size={16}/></Btn>
        </Panel><Panel><h3>Why pledged units are protected</h3><div className="info-grid"><div><LockKeyhole size={21}/><strong>Transfer restricted</strong><p>Once active, locked ANSH cannot be sold in the demo workflow.</p></div><div><ShieldCheck size={21}/><strong>Authorized release</strong><p>A lender must confirm repayment, then release the lock.</p></div><div><TrendingUp size={21}/><strong>Monitored value</strong><p>Indicative scenarios show collateral coverage sensitivity.</p></div></div>
          <div className="notice-box"><Info size={16}/> A valid security interest and actual lending require institutional and legal arrangements beyond this hackathon prototype.</div>
        </Panel></div>
        <Panel><div className="panel-heading"><div><h3>Pledge lifecycle</h3><p>Review decisions in the Lender workspace</p></div></div><div className="table-wrap"><table><thead><tr><th>Pledge</th><th>Units</th><th>Estimated amount</th><th>Lender</th><th>Status</th></tr></thead><tbody>{state.pledges.map(p=><tr key={p.id}><td className="mono">{p.id}</td><td>{p.units.toLocaleString('en-IN')}</td><td>{INR(p.amount)}</td><td>{p.lender}</td><td><Status value={p.status}/></td></tr>)}</tbody></table></div></Panel>
      </>}
      {visible==='manager'&&<><Heading title="Asset Management" desc="Register, issue, track and service fractional real-estate interests." actions={<Btn secondary onClick={()=>setManagerTab('issue')}><Plus size={16}/> Issue ANSH</Btn>}/>
        <div className="metrics three"><Metric title="Authorized supply" value={state.maxUnits.toLocaleString('en-IN')} Icon={Building2} sub="TechPark One · synthetic"/><Metric title="Issued ANSH" value={state.issuedUnits.toLocaleString('en-IN')} Icon={CheckCircle2} sub="Demo registry supply"/><Metric title="Distribution events" value={String(state.distributions.length)} Icon={HandCoins} sub="Income servicing"/></div>
        <div className="tab-row">{[['overview','Asset overview'],['issue','Issue ANSH'],['income','Distributions']].map(([key,label])=><button key={key} className={managerTab===key?'active':''} onClick={()=>setManagerTab(key as typeof managerTab)}>{label}</button>)}</div>
        {managerTab==='overview'&&<div className="two-col major"><Panel><h3>Managed assets</h3><div className="featured-row"><img src={ASSETS[0].image} alt="Office asset"/><div><h4>TechPark One</h4><p>Bengaluru · Grade-A commercial</p><Source/></div></div><div className="detail-list"><div><span>Issuance capacity remaining</span><strong>{(state.maxUnits-state.issuedUnits).toLocaleString('en-IN')}</strong></div><div><span>Registry status</span><Status value="ACTIVE"/></div><div><span>Instrument type</span><strong>ANSH economic interest</strong></div></div></Panel><Panel><h3>Ownership registry snapshot</h3><div className="detail-list"><div><span>Demo investor</span><strong>{state.ownedUnits.toLocaleString('en-IN')} owned</strong></div><div><span>Available</span><strong>{available.toLocaleString('en-IN')}</strong></div><div><span>Encumbered</span><strong>{pledged.toLocaleString('en-IN')}</strong></div></div><p className="footnote">Additional holders and issuer allocations will come from organization-scoped Python APIs.</p></Panel></div>}
        {managerTab==='issue'&&<div className="two-col major"><Panel><h3>Issue additional ANSH interests</h3><p className="panel-intro">This action changes only synthetic browser-local issued supply.</p><div className="field"><label>Asset</label><div className="readonly-field">TechPark One</div></div><div className="field"><label htmlFor="issue-units">Units to issue</label><input id="issue-units" type="number" value={issuanceInput} min={1} step={1} onChange={e=>setIssuanceInput(Number(e.target.value))}/></div><div className="quote"><div><span>Current issued</span><strong>{state.issuedUnits.toLocaleString('en-IN')}</strong></div><div><span>Remaining authorization</span><strong>{(state.maxUnits-state.issuedUnits).toLocaleString('en-IN')}</strong></div></div><Btn onClick={()=>changeState(s=>issueAnsh(s,issuanceInput),'Synthetic issuance recorded in demo audit history.')}>Record demo issuance <ArrowRight size={16}/></Btn></Panel><Panel><h3>Controls & commitments</h3><div className="steps"><div className="step"><span className="step-num">1</span><div><strong>Permission check</strong><small>Asset manager organization</small></div></div><div className="step"><span className="step-num">2</span><div><strong>Supply validation</strong><small>Authorized maximum issuance</small></div></div><div className="step"><span className="step-num">3</span><div><strong>Ledger commit</strong><small>Required in final DRUNIX integration</small></div></div></div></Panel></div>}
        {managerTab==='income'&&<div className="two-col major"><Panel><h3>Record income distribution</h3><div className="field"><label htmlFor="record-date">Record date</label><input type="date" id="record-date" value={distributionDate} onChange={e=>setDistributionDate(e.target.value)}/></div><div className="field"><label htmlFor="income-value">Income per ANSH (₹)</label><input id="income-value" type="number" value={distributionValue} min={0.01} step={0.01} onChange={e=>setDistributionValue(Number(e.target.value))}/></div><div className="quote"><div><span>Issued units</span><strong>{state.issuedUnits.toLocaleString('en-IN')}</strong></div><div><span>Total entitlement</span><strong>{INR(state.issuedUnits*distributionValue)}</strong></div></div><Btn onClick={()=>changeState(s=>recordDistribution(s,distributionValue,distributionDate),'Synthetic distribution event recorded.')}>Record distribution <ArrowRight size={16}/></Btn></Panel><Panel><h3>Distribution history</h3>{state.distributions.map(d=><div className="simple-row" key={d.id}><div><strong>{d.id}</strong><small>Record date {d.date}</small></div><div className="align-right"><strong>{INR(d.amountPerUnit)} / unit</strong><Status value={d.status}/></div></div>)}</Panel></div>}
      </>}
      {visible==='lender'&&<><Heading title="Lender Dashboard" desc="Institutional review of collateral requests, risk and authorized releases."/>
        <div className="metrics three"><Metric title="Pending applications" value={String(pendingPledges.length)} Icon={FileClock} sub="Awaiting lender decision"/><Metric title="Active pledges" value={String(activePledges.length)} Icon={LockKeyhole} sub="Includes repaid pending release"/><Metric title="Encumbered units" value={pledged.toLocaleString('en-IN')} Icon={ShieldCheck} sub="Synthetic registry restriction"/></div>
        <div className="tab-row">{[['applications','Loan applications'],['risk','Risk & release']].map(([key,label])=><button key={key} className={lenderTab===key?'active':''} onClick={()=>setLenderTab(key as typeof lenderTab)}>{label}</button>)}</div>
        {lenderTab==='applications'&&<Panel><div className="panel-heading"><div><h3>Collateral applications</h3><p>Bank decisions are simulated; locks do not represent enforceable real security</p></div></div>
          <div className="table-wrap"><table><thead><tr><th>Request ID</th><th>Borrower</th><th>Asset</th><th>Units</th><th>Requested amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{state.pledges.map(p=><tr key={p.id}><td className="mono">{p.id}</td><td>{p.borrower}</td><td>TechPark One</td><td>{p.units}</td><td>{INR(p.amount)}</td><td><Status value={p.status}/></td><td>{p.status==='REQUESTED'?<div className="button-row compact"><button className="mini-btn approve" onClick={()=>changeState(s=>decidePledge(s,p.id,true),'Pledge approved and synthetic units locked.')}>Approve</button><button className="mini-btn reject" onClick={()=>changeState(s=>decidePledge(s,p.id,false),'Pledge request rejected.')}>Reject</button></div>:<span className="muted">—</span>}</td></tr>)}</tbody></table></div></Panel>}
        {lenderTab==='risk'&&<><div className="two-col major"><Panel><h3>Collateral monitoring</h3><div className="detail-list"><div><span>Indicative collateral coverage</span><strong>{(100/(65*(1+state.valuationShock/100))).toFixed(2)}×</strong></div><div><span>Valuation scenario</span><strong>{state.valuationShock}%</strong></div><div><span>Locked ANSH units</span><strong>{pledged}</strong></div></div><div className="notice-box"><Info size={16}/> Risk estimates are illustrative. Real lender policies may differ.</div></Panel>
          <Panel><h3>Repayment and authorized release</h3>{activePledges.length===0?<Empty title="No active collateral" desc="Approved pledges will appear here."/>:activePledges.map(p=><div className="simple-row" key={p.id}><div><strong>{p.id} · {p.units} units</strong><small>{p.borrower} · {INR(p.amount)}</small><Status value={p.status}/></div>{p.status==='ACTIVE'?<Btn secondary onClick={()=>changeState(s=>repayPledge(s,p.id),'Simulated repayment recorded. Release still required.')}>Confirm repayment</Btn>:<Btn onClick={()=>changeState(s=>releasePledge(s,p.id),'Pledge released. Units are transferable again.')}>Authorize release</Btn>}</div>)}</Panel></div></>}
      </>}
      {visible==='audit'&&<><Heading title="Transactions & Audit" desc="Follow each event across the simulated real-estate lifecycle." actions={<Btn secondary onClick={()=>{const data=JSON.stringify(state.events,null,2);const blob=new Blob([data],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='tokansh-demo-audit.json';a.click();URL.revokeObjectURL(url);}}><ArrowDownRight size={16}/> Export demo audit</Btn>}/>
        <div className="metrics three"><Metric title="Audit events" value={String(state.events.length)} Icon={FileClock} sub="Browser-local event history"/><Metric title="Trade records" value={String(state.trades.length)} Icon={ArrowLeftRight} sub="Includes payment failures"/><Metric title="Collateral records" value={String(state.pledges.length)} Icon={LockKeyhole} sub="Pending, active and released"/></div>
        <Panel><div className="panel-heading"><div><h3>Complete lifecycle history</h3><p>Operation IDs are illustrative and are not DRUNIX transaction hashes.</p></div><Source/></div><ActivityList state={state} limit={100}/></Panel>
      </>}
      {visible==='intelligence'&&<><Heading title="Intelligence Studio" desc="Explore valuation and occupancy sensitivity using non-authoritative scenarios."/>
        <div className="two-col major"><Panel><h3>What-if analysis</h3><div className="field"><label htmlFor="shock">Asset valuation change: {shock}%</label><input id="shock" type="range" min={-50} max={50} step={1} value={shock} onChange={e=>setShock(Number(e.target.value))}/></div><div className="field"><label htmlFor="occupancy">Occupancy assumption: {occupancy}%</label><input id="occupancy" type="range" min={30} max={100} value={occupancy} onChange={e=>setOccupancy(Number(e.target.value))}/></div><Btn onClick={()=>changeState(s=>applyShock(s,shock),'Illustrative scenario valuation updated.')}>Evaluate scenario <ArrowRight size={16}/></Btn><p className="footnote">Changing an indicative valuation does not transfer or alter any ANSH units.</p></Panel>
          <Panel><h3>Scenario results</h3><div className="detail-list"><div><span>Current indicative value</span><strong>{INR(totalValue,true)}</strong></div><div><span>Proposed scenario value</span><strong>{INR(state.ownedUnits*ASSETS[0].unitPrice*(1+shock/100),true)}</strong></div><div><span>Income impact estimate</span><strong>{(occupancy/ASSETS[0].occupancy*100-100).toFixed(1)}%</strong></div><div><span>Potential pledge value</span><strong>{INR(pledged*ASSETS[0].unitPrice*(1+shock/100)*.65,true)}</strong></div></div><Source label="INDICATIVE"/></Panel></div>
      </>}
      <footer className="footer"><span>© 2026 TokANSH · DRUNIX Hackathon prototype</span><span>Demo data only · Not investment or lending advice</span></footer>
      </div>
    </main>
  </div>;
}
