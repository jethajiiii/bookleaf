/**
 * StatCards displays the 4 key operational metrics for the admin queue:
 * Open, Critical, Unassigned, and Overdue 3d+.
 *
 * @param {Object} props
 * @param {Object} props.stats
 * @param {number} props.stats.open
 * @param {number} props.stats.criticalUnresolved
 * @param {number} props.stats.unassigned
 * @param {number} props.stats.overdue
 * @param {Function} [props.onSelectCard] Optional filter quick-action
 */
export function StatCards({ stats = {}, onSelectCard }) {
  const cards = [
    {
      key: 'open',
      label: 'Open Folios',
      value: stats.open ?? 0,
      description: 'Awaiting response',
      accentBg: 'bg-[#3F7F8C]',
      filterParams: { status: 'open' },
    },
    {
      key: 'critical',
      label: 'Critical Priority',
      value: stats.criticalUnresolved ?? 0,
      description: 'Active urgent folios',
      accentBg: 'bg-[#984221]',
      filterParams: { priority: 'critical' },
    },
    {
      key: 'unassigned',
      label: 'Unassigned',
      value: stats.unassigned ?? 0,
      description: 'Pending curator allocation',
      accentBg: 'bg-[#C88C35]',
      filterParams: { assigned: 'unassigned' },
    },
    {
      key: 'overdue',
      label: 'Overdue 72h+',
      value: stats.overdue ?? 0,
      description: 'Exceeded SLA threshold',
      accentBg: 'bg-[#D4704B]',
      filterParams: { status: 'open' },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={() => onSelectCard?.(card.filterParams)}
          className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-5 text-left transition-all hover:shadow-soft-card hover:border-[#984221]/30 focus:outline-none focus:ring-1 focus:ring-[#984221]/40 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#55433c] font-sans">
              {card.label}
            </span>
            <span className={`w-2 h-2 rounded-full ${card.accentBg}`} />
          </div>
          <p className="font-editorial text-3xl sm:text-4xl font-normal text-[#2B2622] tracking-tight">
            {card.value}
          </p>
          <p className="text-[11px] text-[#2B2622]/60 mt-1 truncate font-display-italic">
            {card.description}
          </p>
        </button>
      ))}
    </div>
  );
}

export default StatCards;
