import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva,type VariantProps} from 'class-variance-authority';
import {cn} from '../../utils/cn';
const styles=cva('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
 {variants:{variant:{primary:'bg-[#1769AA] text-white hover:bg-[#12578d]',secondary:'bg-white border border-slate-300 text-[#102B4E] hover:bg-slate-50',ghost:'text-slate-600 hover:bg-slate-100',danger:'bg-red-600 text-white hover:bg-red-700'},size:{sm:'px-3 py-1.5 text-xs',md:'px-4 py-2.5 text-sm'}},defaultVariants:{variant:'primary',size:'md'}});
export type ButtonProps=React.ButtonHTMLAttributes<HTMLButtonElement>&VariantProps<typeof styles>&{asChild?:boolean};
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,...props},ref)=>{
 const Comp=asChild?Slot:'button';
 return <Comp ref={ref} className={cn(styles({variant,size}),className)} {...props}/>;
});
Button.displayName='Button';
