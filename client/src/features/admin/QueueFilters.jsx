import { CATEGORIES, CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS } from '../../lib/constants.js';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active Folios' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All Records' },
];

const ASSIGNED_OPTIONS = [
  { value: '', label: 'All Curators' },
  { value: 'me', label: 'Assigned to Me' },
  { value: 'unassigned', label: 'Unassigned' },
];

/**
 * Editorial QueueFilters controls URL-bound filtering for the admin ticket queue.
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
    <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-5 space-y-4 shadow-soft-card">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5DCCE]/80 pb-4">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-[#55433c] mr-2">
          Folio Status:
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange('status', opt.value === 'active' ? '' : opt.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#3F7F8C] text-white shadow-xs font-semibold'
                  : 'bg-[#FAF5EE] border border-[#E5DCCE] text-[#55433c] hover:text-[#2B2622] hover:bg-[#F2ECE3]'
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
          <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#55433c] mb-1.5 uppercase">
            Folio Category
          </label>
          <select
            value={currentCategory}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] text-xs focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all"
          >
            <option value="">All Categories</option>
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#55433c] mb-1.5 uppercase">
            Urgency / Priority
          </label>
          <select
            value={currentPriority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] text-xs focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all"
          >
            <option value="">All Priorities</option>
            {Object.values(PRIORITIES).map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned */}
        <div>
          <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#55433c] mb-1.5 uppercase">
            Archival Curator
          </label>
          <select
            value={currentAssigned}
            onChange={(e) => onFilterChange('assigned', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] text-xs focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all"
          >
            {ASSIGNED_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range: From */}
        <div>
          <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#55433c] mb-1.5 uppercase">
            Dispatched From
          </label>
          <input
            type="date"
            value={currentFrom}
            onChange={(e) => onFilterChange('from', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] text-xs focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all"
          />
        </div>

        {/* Date Range: To & Clear */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-sans font-semibold tracking-wider text-[#55433c] uppercase">
              Dispatched To
            </label>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] text-[#984221] hover:underline font-semibold uppercase cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="date"
            value={currentTo}
            onChange={(e) => onFilterChange('to', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] text-xs focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all"
          />
        </div>
      </div>
    </div>
  );
}

export default QueueFilters;
