import * as Dialog from '@radix-ui/react-dialog';
import type {ReactNode} from 'react';
import {X} from 'lucide-react';
import {Button} from './button';
export function ReviewDialog({open,onOpenChange,title,description,children,onConfirm,confirmLabel='Confirm',busy=false}:{open:boolean;onOpenChange:(v:boolean)=>void;title:string;description:string;children:ReactNode;onConfirm:()=>void;confirmLabel?:string;busy?:boolean}){
 return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[150] bg-slate-950/55"/>
 <Dialog.Content className="fixed left-1/2 top-1/2 z-[151] w-[min(92vw,530px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl" aria-describedby="review-description">
 <div className="flex items-start justify-between gap-4"><Dialog.Title className="text-lg font-bold text-[#102B4E]">{title}</Dialog.Title><Dialog.Close className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={19}/></Dialog.Close></div>
 <Dialog.Description id="review-description" className="mt-2 text-sm text-slate-500">{description}</Dialog.Description>
 <div className="my-5 rounded-lg border border-slate-200 bg-slate-50 p-4">{children}</div>
 <div className="flex justify-end gap-2"><Button variant="secondary" onClick={()=>onOpenChange(false)}>Cancel</Button><Button onClick={onConfirm} disabled={busy}>{busy?'Submitting…':confirmLabel}</Button></div>
 </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
