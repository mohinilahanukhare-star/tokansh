export type Role = 'INVESTOR' | 'ASSET_MANAGER' | 'LENDER' | 'ADMIN';
export type Asset = {
  id: string; name: string; subtitle: string; city: string; kind: string;
  valuation: number; unitPrice: number; occupancy: number; yieldPct: number;
  image: string; status: 'ACTIVE' | 'COMING_SOON'; size: string;
  description: string; rights: string; source: 'SIMULATED';
};
export type Trade = {
  id: string; side: 'BUY' | 'SELL'; assetId: string; units: number;
  amount: number; status: 'PAYMENT_FAILED' | 'COMMITTED' | 'REJECTED' | 'AWAITING_PAYMENT';
  payment: 'FAILED' | 'CONFIRMED' | 'PENDING' | 'NOT_REQUIRED';
  time: string; detail: string;
};
export type Pledge = {
  id: string; units: number; amount: number; status: 'REQUESTED' | 'ACTIVE' | 'REPAID' | 'RELEASED' | 'REJECTED';
  lender: string; borrower: string; time: string;
};
export type Distribution = {
  id: string; date: string; amountPerUnit: number; total: number;
  status: 'RECORDED' | 'SIMULATED_PAYOUT'; time: string;
};
export type Event = {
  id: string; kind: string; text: string; status: string; time: string;
  source: 'SIMULATED'; actor: string;
};
export type DemoState = {
  ownedUnits: number; issuedUnits: number; maxUnits: number;
  cashBalance: number; valuationShock: number;
  trades: Trade[]; pledges: Pledge[]; distributions: Distribution[]; events: Event[];
};

export const ASSETS: Asset[] = [
  {
    id: 'techpark_one', name: 'TechPark One', subtitle: 'Grade-A commercial offices',
    city: 'Bengaluru, Karnataka', kind: 'Commercial', valuation: 1000000000,
    unitPrice: 10000, occupancy: 94, yieldPct: 8.2, status: 'ACTIVE',
    size: '112,000 sq ft', source: 'SIMULATED',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    description: 'An illustrative commercial office asset with an established tenant profile, planned fractional interests and periodic income servicing.',
    rights: 'Illustrative economic participation rights only. An ANSH unit does not automatically represent registered property title.'
  },
  {
    id: 'greenline_residences', name: 'Greenline Residences',
    subtitle: 'Residential rental community', city: 'Pune, Maharashtra', kind: 'Residential',
    valuation: 620000000, unitPrice: 12500, occupancy: 89, yieldPct: 6.4,
    status: 'COMING_SOON', size: '62 apartments', source: 'SIMULATED',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    description: 'An example residential property for exploring possible future TokANSH offerings.',
    rights: 'Illustrative future opportunity. No ANSH units available for trading.'
  },
  {
    id: 'harbor_logistics', name: 'Harbor Logistics Hub', subtitle: 'Warehousing & logistics',
    city: 'Mumbai, Maharashtra', kind: 'Industrial', valuation: 850000000,
    unitPrice: 15000, occupancy: 97, yieldPct: 7.7, status: 'COMING_SOON',
    size: '82,000 sq ft', source: 'SIMULATED',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    description: 'A sample logistics real-estate opportunity for UI comparison only.',
    rights: 'Illustrative future opportunity. No ANSH units available for trading.'
  }
];

export const DEMO_ACCOUNTS: {role: Role; label: string; email: string; initial: string}[] = [
  { role: 'INVESTOR', label: 'Aarav · Investor', email: 'investor@demo.tokansh.local', initial: 'A' },
  { role: 'ASSET_MANAGER', label: 'Meera · Asset Manager', email: 'manager@demo.tokansh.local', initial: 'M' },
  { role: 'LENDER', label: 'Institution · Lender', email: 'lender@demo.tokansh.local', initial: 'L' },
  { role: 'ADMIN', label: 'Demo Admin', email: 'admin@demo.tokansh.local', initial: 'D' }
];

const timestamp = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
const event = (kind: string, text: string, status: string, actor: string): Event =>
  ({id: uid('ev'), kind, text, status, time: timestamp(), source: 'SIMULATED', actor});

export function initialState(): DemoState {
  return {
    ownedUnits: 5240, issuedUnits: 80000, maxUnits: 100000,
    cashBalance: 25000000, valuationShock: 0,
    trades: [
      {id:'trade_098',side:'BUY',assetId:'techpark_one',units:240,amount:2400000,status:'COMMITTED',payment:'CONFIRMED',time:'2026-11-12T10:30:00Z',detail:'Demo settlement completed'},
      {id:'trade_097',side:'BUY',assetId:'techpark_one',units:500,amount:5000000,status:'COMMITTED',payment:'CONFIRMED',time:'2026-11-07T12:00:00Z',detail:'Demo settlement completed'}
    ],
    pledges: [{id:'pledge_001',units:1000,amount:6500000,status:'ACTIVE',lender:'Demo Institutional Lender',borrower:'Aarav',time:'2026-11-10T11:00:00Z'}],
    distributions: [{id:'dist_001',date:'2026-10-31',amountPerUnit:10,total:524000,status:'SIMULATED_PAYOUT',time:'2026-11-01T09:00:00Z'}],
    events: [
      {id:'evt_001',kind:'PLEDGE',text:'1,000 ANSH units locked in demo collateral ledger',status:'ACTIVE',time:'2026-11-10T11:00:00Z',source:'SIMULATED',actor:'Lender'},
      {id:'evt_002',kind:'TRADE',text:'Trade trade_098: 240 ANSH units purchased',status:'COMMITTED',time:'2026-11-12T10:30:00Z',source:'SIMULATED',actor:'Investor'},
      {id:'evt_003',kind:'DISTRIBUTION',text:'October income distribution recorded',status:'RECORDED',time:'2026-11-01T09:00:00Z',source:'SIMULATED',actor:'Asset manager'}
    ]
  };
}
export function getDemoState(): DemoState {
  try {
    const raw = window.localStorage.getItem('tokansh-demo-v2');
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (Array.isArray(parsed.trades) && Array.isArray(parsed.pledges)) return parsed;
    }
  } catch { /* storage blocked — use in-memory demo */ }
  return initialState();
}
export function saveDemoState(state: DemoState): void {
  try { window.localStorage.setItem('tokansh-demo-v2', JSON.stringify(state)); } catch { /* optional */ }
}
export function pledgedUnits(s: DemoState): number {
  return s.pledges.filter(p => p.status === 'ACTIVE' || p.status === 'REPAID').reduce((sum, p) => sum + p.units, 0);
}
export function availableUnits(s: DemoState): number {
  return Math.max(0, s.ownedUnits - pledgedUnits(s));
}
export function effectivePrice(s: DemoState): number {
  return Math.round(ASSETS[0].unitPrice * (1 + s.valuationShock / 100));
}
export function INR(value: number, compact = false): string {
  if (!Number.isFinite(value)) return '—';
  if (compact && Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (compact && Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return '₹' + Math.round(value).toLocaleString('en-IN');
}
export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'});
}
export function withEvent(s: DemoState, kind: string, text: string, status: string, actor: string): void {
  s.events.unshift(event(kind, text, status, actor));
}
export function placeTrade(state: DemoState, side: 'BUY' | 'SELL', units: number, failPayment: boolean): DemoState {
  const s = structuredClone(state);
  if (!Number.isSafeInteger(units) || units <= 0) throw new Error('Enter a valid whole-number ANSH quantity.');
  if (units > 100000) throw new Error('Quantity exceeds the allowed demo limit.');
  if (side === 'SELL' && units > availableUnits(s)) {
    withEvent(s,'TRANSFER',`Rejected sale of ${units} units: only ${availableUnits(s)} are unlocked`,'REJECTED','Investor');
    throw new Error(`Transfer blocked: only ${availableUnits(s).toLocaleString('en-IN')} ANSH units are available. Pledged units cannot be sold.`);
  }
  const amount = units * ASSETS[0].unitPrice;
  if (side === 'BUY' && !failPayment && amount > s.cashBalance) throw new Error('Insufficient simulated wallet balance.');
  const status: Trade['status'] = failPayment ? 'PAYMENT_FAILED' : 'COMMITTED';
  const trade: Trade = {id:uid('trade'),side,assetId:'techpark_one',units,amount,status,
    payment: failPayment ? 'FAILED' : 'CONFIRMED',time:timestamp(),
    detail: failPayment ? 'Payment failed; ownership unchanged. Retry available.' : 'Simulated settlement committed.'};
  s.trades.unshift(trade);
  if (!failPayment) {
    s.ownedUnits += side === 'BUY' ? units : -units;
    s.cashBalance += side === 'BUY' ? -amount : amount;
  }
  withEvent(s,'TRADE',`${side} ${units} ANSH · ${failPayment ? 'payment failed' : 'simulated commit'}`,status,'Investor');
  return s;
}
export function retryTrade(state: DemoState, id: string): DemoState {
  const s = structuredClone(state);
  const trade = s.trades.find(x => x.id === id);
  if (!trade || trade.status !== 'PAYMENT_FAILED') throw new Error('This trade cannot be retried.');
  if (trade.side === 'BUY' && trade.amount > s.cashBalance) throw new Error('Insufficient simulated wallet balance.');
  if (trade.side === 'SELL' && trade.units > availableUnits(s)) throw new Error('The ANSH units are no longer transferable.');
  trade.status = 'COMMITTED'; trade.payment = 'CONFIRMED'; trade.detail = 'Retry succeeded; simulated settlement committed.';
  s.ownedUnits += trade.side === 'BUY' ? trade.units : -trade.units;
  s.cashBalance += trade.side === 'BUY' ? -trade.amount : trade.amount;
  withEvent(s,'TRADE',`Retry succeeded for ${id}; ownership updated once`,'COMMITTED','Investor');
  return s;
}
export function requestPledge(state: DemoState, units: number): DemoState {
  const s = structuredClone(state);
  if (!Number.isSafeInteger(units) || units <= 0 || units > availableUnits(s)) throw new Error('Requested collateral exceeds available unpledged ANSH units.');
  const pledge: Pledge = {id:uid('pledge'),units,amount:units * effectivePrice(s) * .65,status:'REQUESTED',
    lender:'Demo Institutional Lender',borrower:'Aarav',time:timestamp()};
  s.pledges.unshift(pledge);
  withEvent(s,'PLEDGE',`Collateral request for ${units} units submitted to lender`,'REQUESTED','Investor');
  return s;
}
export function decidePledge(state: DemoState, id: string, approve: boolean): DemoState {
  const s = structuredClone(state);
  const p = s.pledges.find(x=>x.id===id);
  if (!p || p.status!=='REQUESTED') throw new Error('Only pending pledge requests can be decided.');
  if (approve && p.units > availableUnits(s)) throw new Error('Investor now has insufficient unlocked units.');
  p.status = approve ? 'ACTIVE' : 'REJECTED';
  withEvent(s,'PLEDGE',`Pledge ${id} ${approve ? 'approved and simulated lock committed' : 'rejected'}`,p.status,'Lender');
  return s;
}
export function repayPledge(state: DemoState, id: string): DemoState {
  const s = structuredClone(state);
  const p = s.pledges.find(x=>x.id===id);
  if (!p || p.status!=='ACTIVE') throw new Error('Only active pledges can record repayment.');
  p.status = 'REPAID';
  withEvent(s,'REPAYMENT',`Simulated repayment confirmed for ${id}; lender release required`,'REPAID','Lender');
  return s;
}
export function releasePledge(state: DemoState, id: string): DemoState {
  const s = structuredClone(state);
  const p = s.pledges.find(x=>x.id===id);
  if (!p || p.status!=='REPAID') throw new Error('Repayment must be confirmed before authorized release.');
  p.status = 'RELEASED';
  withEvent(s,'PLEDGE',`Authorized release for ${p.units} ANSH units: ${id}`,'RELEASED','Lender');
  return s;
}
export function issueAnsh(state: DemoState, units: number): DemoState {
  const s = structuredClone(state);
  if (!Number.isSafeInteger(units) || units <= 0 || s.issuedUnits + units > s.maxUnits) {
    throw new Error(`Issuance exceeds remaining authorized capacity (${s.maxUnits-s.issuedUnits} units).`);
  }
  s.issuedUnits += units;
  withEvent(s,'ISSUANCE',`${units.toLocaleString('en-IN')} additional ANSH units issued in synthetic registry`,'COMMITTED','Asset manager');
  return s;
}
export function recordDistribution(state: DemoState, perUnit: number, date: string): DemoState {
  const s = structuredClone(state);
  if (!Number.isFinite(perUnit) || perUnit<=0 || !date) throw new Error('Enter a valid record date and positive distribution amount.');
  const total=perUnit*s.issuedUnits;
  s.distributions.unshift({id:uid('dist'),date,amountPerUnit:perUnit,total,status:'RECORDED',time:timestamp()});
  withEvent(s,'DISTRIBUTION',`Synthetic income event recorded: ${INR(perUnit)} per ANSH`,'RECORDED','Asset manager');
  return s;
}
export function applyShock(state: DemoState, shock: number): DemoState {
  const s = structuredClone(state);
  if (!Number.isFinite(shock) || shock < -50 || shock > 50) throw new Error('Scenario must be between -50% and +50%.');
  s.valuationShock = shock;
  return s;
}
