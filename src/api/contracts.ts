/** Selected frontend API shapes and status model from the team's API_CONTRACTS.md. */
export type ApiStatus='CREATED'|'DRAFT'|'PENDING'|'PROCESSING'|'SUBMITTED'|'COMMITTED'|'FAILED'|'UNKNOWN'|'RECONCILIATION_REQUIRED';
export type ApiError={code:string;message:string;details?:Record<string,unknown>};
export type ApiResult<T>={data:T;meta?:{request_id?:string;timestamp?:string}};
export type SystemComponent={name:string;status:'CONNECTED'|'UNAVAILABLE'|'UNKNOWN'|'DEGRADED';detail?:string};
export type SystemStatus={components:SystemComponent[];last_ledger_operation?:string|null};
export type PropertyRecord={id:string;name:string;location:string;category:string;valuation:string;approved_supply:number;unit_price:string;status:string;issuer_id?:string;ledger_status?:ApiStatus;ledger_transaction_id?:string|null};
export type PortfolioRecord={user_id:string;holdings:{property_id:string;owned_units:number;available_units:number;pledged_units:number;source:string;as_of?:string}[]};
export type LedgerOperation={operation_id:string;status:ApiStatus;ledger_transaction_id?:string|null;error_code?:string;created_at:string;confirmed_at?:string|null};
export type NewProperty={name:string;location:string;category:string;valuation:string;proposed_supply:number;issue_price:string;currency:'INR'};
export type NewIssuance={property_id:string;quantity:number;issue_price:string;currency:'INR'};
export type NewOrder={listing_id:string;quantity:number;currency:'INR'};
export type NewPledge={property_id:string;quantity:number;loan_amount:string};
export const route={
 status:'/api/v1/system/status',properties:'/api/v1/properties',issuances:'/api/v1/ansh/issuances',
 listings:'/api/v1/marketplace/listings',orders:'/api/v1/marketplace/orders',
 payments:'/api/v1/payments/simulate',pledges:'/api/v1/collateral/pledges',
 loans:'/api/v1/loans/applications',distributions:'/api/v1/distributions',
 audit:'/api/v1/audit/events',demoRole:'/api/v1/demo/active-role'
} as const;
