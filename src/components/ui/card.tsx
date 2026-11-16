import type {ReactNode} from 'react';
import {cn} from '../../utils/cn';
export function Card({children,className='',title,description,action}:{children:ReactNode;className?:string;title?:string;description?:string;action?:ReactNode}){
 return <section className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-card',className)}>
 {title&&<div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-bold text-[#102B4E]">{title}</h2>{description&&<p className="mt-1 text-xs text-slate-500">{description}</p>}</div>{action}</div>}{children}</section>;
}
export function SectionHeading({title,description,action}:{title:string;description:string;action?:ReactNode}){
 return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#607D9B]">TokANSH / Workspace</p><h1 className="text-[25px] font-extrabold text-[#102B4E]">{title}</h1><p className="mt-1.5 text-sm text-slate-500">{description}</p></div>{action}</div>;
}
export function Metric({label,value,description}:{label:string;value:string;description?:string}){
 return <Card className="py-4"><p className="text-xs font-medium text-slate-500">{label}</p><p className="font-financial mt-2 text-2xl font-extrabold text-[#102B4E]">{value}</p>{description&&<p className="mt-2 text-xs text-slate-500">{description}</p>}</Card>;
}
export function EmptyState({title,description}:{title:string;description:string}){return <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-9 text-center"><p className="font-semibold text-slate-700">{title}</p><p className="mt-2 text-sm text-slate-500">{description}</p></div>;}
