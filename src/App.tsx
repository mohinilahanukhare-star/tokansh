import {Navigate,Route,Routes} from 'react-router-dom';
import type {ReactNode} from 'react';
import {useApp} from './app/context';
import type {Role} from './demo/scenario';
import {roleOptions} from './demo/scenario';
import {Shell} from './components/Shell';
import {Button} from './components/ui/button';
import {Card} from './components/ui/card';
import {PreviewWarning} from './components/ui/status';
import {Overview,Portfolio} from './pages/Overview';
import {Registry,Issuance,Marketplace} from './pages/RealEstate';
import {Collateral,Lending} from './pages/Finance';
import {Distributions,Audit,Intelligence,System} from './pages/Supporting';
function Guard({roles,children}:{roles:Role[];children:ReactNode}){
 const {role}=useApp();return roles.includes(role)?<>{children}</>:<Navigate to="/overview" replace/>;
}
function Landing(){
 const {role,setRole}=useApp();
 return <main className="flex min-h-screen items-center justify-center bg-[#F4F6F9] p-4">
 <div className="w-full max-w-xl"><div className="mb-7 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#102B4E] text-3xl text-blue-200">◈</div><h1 className="text-3xl font-extrabold text-[#102B4E]">Welcome to TokANSH</h1><p className="mt-2 text-sm text-slate-500">Unlocking Real Estate, One Ansh at a Time.</p></div>
 <Card title="Choose a demonstration role" description="Role selection is a UI preview, not identity verification or production login.">
 <fieldset className="space-y-3"><legend className="sr-only">Demonstration role</legend>{roleOptions.map(item=><label key={item.role} className={'flex cursor-pointer gap-3 rounded-lg border p-4 '+(role===item.role?'border-[#1769AA] bg-blue-50':'border-slate-200 hover:border-blue-300')}><input type="radio" name="demo-role" checked={role===item.role} onChange={()=>setRole(item.role)}/><span><strong className="text-sm text-[#102B4E]">{item.label}</strong><span className="mt-1 block text-xs text-slate-500">{item.description}</span></span></label>)}</fieldset>
 <div className="mt-5"><PreviewWarning compact/></div><Button asChild className="mt-5 w-full"><a href="#/overview">Enter preview workspace</a></Button>
 </Card></div></main>;
}
export default function App(){
 return <Routes>
 <Route path="/login" element={<Landing/>}/>
 <Route element={<Shell/>}>
  <Route path="/overview" element={<Overview/>}/>
  <Route path="/registry" element={<Guard roles={['ISSUER']}><Registry/></Guard>}/>
  <Route path="/issuance" element={<Guard roles={['ISSUER']}><Issuance/></Guard>}/>
  <Route path="/marketplace" element={<Guard roles={['ISSUER','INVESTOR']}><Marketplace/></Guard>}/>
  <Route path="/portfolio" element={<Guard roles={['INVESTOR']}><Portfolio/></Guard>}/>
  <Route path="/transactions" element={<Audit mode="transactions"/>}/>
  <Route path="/intelligence" element={<Guard roles={['ISSUER','INVESTOR']}><Intelligence/></Guard>}/>
  <Route path="/collateral" element={<Guard roles={['INVESTOR','LENDER']}><Collateral/></Guard>}/>
  <Route path="/lending" element={<Guard roles={['INVESTOR','LENDER']}><Lending/></Guard>}/>
  <Route path="/distributions" element={<Guard roles={['ISSUER','INVESTOR']}><Distributions/></Guard>}/>
  <Route path="/audit" element={<Guard roles={['ISSUER','LENDER']}><Audit/></Guard>}/>
  <Route path="/system" element={<System/>}/>
 </Route>
 <Route path="*" element={<Navigate to="/login" replace/>}/>
 </Routes>;
}
