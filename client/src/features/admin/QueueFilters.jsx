import { CATEGORIES, CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS } from '../../lib/constants.js';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All' },
];

const ASSIGNED_OPTIONS = [
  { value: '', label: 'All Assignees' },
  { value: 'me', label: 'Assigned to Me' },
  { value: 'unassigned', label: 'Unassigned' },
];

/**
 * QueueFilters controls URL-bound filtering for the admin ticket queue.
 */
export function QueueFilters({ searchParams, onFilterChange, onReset }) {
  const currentStatus = searchParams.get('status') || 'active';
  const currentCategory = searchParams.get('category') || '';
  const currentPriority = searchParams.get('priority') || '';
  const currentAssigned = searchParams.get('assigned') || '';
  const currentFrom = searchParams.get('from') || '';
  const currentTo = searchParams.get('to') || '';

  const hasActiveFilters =
    currentStatus !== 'active' ||
    currentCategory !== '' ||
    currentPriority !== '' ||
    currentAssigned !== '' ||
    currentFrom !== '' ||
    currentTo !== '';

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 space-y-4 shadow-sm">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-card-border pb-3">
        <span className="text-xs font-semibold uppercase text-charcoal-muted mr-1">Status:</span>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange('status', opt.value === 'active' ? '' : opt.value)}
              className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-teal text-white shadow-sm font-semibold'
                  : 'bg-cream-dark/40 border border-card-border text-charcoal-light hover:text-charcoal'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Dropdowns & Date Range */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">Category</label>
          <select
            value={currentCategory}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-card-border bg-cream-light text-charcoal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All Categories</option>
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">Priority</label>
          <select
            value={currentPriority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-card-border bg-cream-light text-charcoal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="">All Priorities</option>
            {Object.values(PRIORITIES).map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>

        {/* Assigned */}
        <div>
          <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">Assignment</label>
          <select
            value={currentAssigned}
            onChange={(e) => onFilterChange('assigned', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-card-border bg-cream-light text-charcoal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            {ASSIGNED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date Range: From */}
        <div>
          <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">From Date</label>
          <input
            type="date"
            value={currentFrom}
            onChange={(e) => onFilterChange('from', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-card-border bg-cream-light text-charcoal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        {/* Date Range: To & Clear */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-charcoal-muted">To Date</label>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] text-terracotta hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="date"
            value={currentTo}
            onChange={(e) => onFilterChange('to', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-card-border bg-cream-light text-charcoal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>
      </div>
    </div>
  );
}

export default QueueFilters;
