import {createContext,useContext,useMemo,useState} from 'react';
import type {ReactNode} from 'react';
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import {request,realBackendConfigured,idempotency} from '../api/transport';
import {route} from '../api/contracts';
import type {SystemStatus} from '../api/contracts';
import type {Role,Phase} from '../demo/scenario';
import {scenarioProperty,scenarioHoldings,scenarioEvents,scenarioEntitlement} from '../demo/scenario';
type Message={kind:'error'|'info'|'submitted';text:string}|null;
type Context={
 role:Role;setRole:(v:Role)=>void;phase:Phase;setPhase:(v:Phase)=>void;message:Message;notify:(v:Message)=>void;
 backendReady:boolean;systemStatus:SystemStatus|null;loadingStatus:boolean;
 property:ReturnType<typeof scenarioProperty>;holding:ReturnType<typeof scenarioHoldings>;
 events:ReturnType<typeof scenarioEvents>;entitlement:ReturnType<typeof scenarioEntitlement>;
 submit:(path:string,body:unknown)=>Promise<void>;submitting:boolean;
};
const ctx=createContext<Context|null>(null);
export function AppProvider({children}:{children:ReactNode}){
 const [role,setRoleState]=useState<Role>('ISSUER');
 const [phase,setPhase]=useState<Phase>('ONBOARDING');
 const [message,notify]=useState<Message>(null);
 const queryClient=useQueryClient();
 const health=useQuery({queryKey:['system-status'],queryFn:()=>request<SystemStatus>(route.status),enabled:realBackendConfigured,refetchInterval:realBackendConfigured?30000:false,retry:1});
 const mutation=useMutation({
  mutationFn:({path,body}:{path:string;body:unknown})=>request<{operation_id?:string;status?:string;message?:string}>(path,{method:'POST',body,idempotencyKey:idempotency()}),
  onSuccess:(data)=>{
   const committed=data?.status==='COMMITTED';
   notify({kind:committed?'submitted':'info',text:committed?'Backend reports COMMITTED; independently verify resulting ledger state and balances.':'Request submitted. Await authoritative ledger status before reflecting any ownership changes.'});
   void queryClient.invalidateQueries();
  },
  onError:(error)=>notify({kind:'error',text:error instanceof Error?error.message:'The request could not be completed'})
 });
 const setRole=(value:Role)=>{setRoleState(value);notify(null);};
 const property=useMemo(()=>scenarioProperty(phase),[phase]);
 const holding=useMemo(()=>scenarioHoldings(phase),[phase]);
 const events=useMemo(()=>scenarioEvents(phase),[phase]);
 const entitlement=useMemo(()=>scenarioEntitlement(phase),[phase]);
 async function submit(path:string,body:unknown){
  if(!realBackendConfigured){notify({kind:'info',text:'UI preview only. This operation requires the Python API and verified DRUNIX connectivity; no ledger state was changed.'});return;}
  await mutation.mutateAsync({path,body}).catch(()=>undefined);
 }
 return <ctx.Provider value={{role,setRole,phase,setPhase,message,notify,backendReady:realBackendConfigured&&health.isSuccess,systemStatus:health.data||null,loadingStatus:health.isFetching,property,holding,events,entitlement,submit,submitting:mutation.isPending}}>{children}</ctx.Provider>;
}
export function useApp(){const value=useContext(ctx);if(!value)throw new Error('AppProvider missing');return value;}
