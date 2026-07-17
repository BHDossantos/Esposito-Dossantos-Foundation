// Illustrative financial + impact model for the transparency dashboard.
// These are planning TARGETS for a foundation in formation — not audited
// results. The page labels them as such; replace with verified figures as they
// become available.

export const fiscalYear = '2026';

export const allocation = [
  { key: 'programs', pct: 78 },
  { key: 'operations', pct: 14 },
  { key: 'fundraising', pct: 8 }
] as const;

export const revenue = [
  { key: 'donations', amount: 420000 },
  { key: 'grants', amount: 260000 },
  { key: 'sponsorships', amount: 180000 },
  { key: 'events', amount: 90000 }
] as const;

export const spendingByPillar = [
  { key: 'education', amount: 260000 },
  { key: 'music', amount: 210000 },
  { key: 'technology', amount: 150000 },
  { key: 'community', amount: 120000 },
  { key: 'leadership', amount: 90000 }
] as const;

// Multi-year impact trajectory (targets).
export const impactSeries = [
  { year: '2026', students: 200, scholarships: 20 },
  { year: '2027', students: 450, scholarships: 45 },
  { year: '2028', students: 700, scholarships: 70 },
  { year: '2029', students: 900, scholarships: 90 },
  { year: '2030', students: 1000, scholarships: 100 }
] as const;

export const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
