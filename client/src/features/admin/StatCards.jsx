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
      label: 'Open Tickets',
      value: stats.open ?? 0,
      description: 'Awaiting first response',
      accent: 'text-teal border-teal/30 bg-teal-light/40',
      filterParams: { status: 'open' },
    },
    {
      key: 'critical',
      label: 'Critical Priority',
      value: stats.criticalUnresolved ?? 0,
      description: 'Active urgent tickets',
      accent: 'text-terracotta border-terracotta/30 bg-terracotta-light/40',
      filterParams: { priority: 'critical' },
    },
    {
      key: 'unassigned',
      label: 'Unassigned',
      value: stats.unassigned ?? 0,
      description: 'Needs admin allocation',
      accent: 'text-mustard-dark border-mustard/30 bg-mustard-light/40',
      filterParams: { assigned: 'unassigned' },
    },
    {
      key: 'overdue',
      label: 'Overdue 3d+',
      value: stats.overdue ?? 0,
      description: 'Unresolved for 72h+',
      accent: 'text-terracotta border-terracotta/40 bg-terracotta-light/50',
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
          className="bg-card border border-card-border rounded-2xl p-5 text-left transition-all hover:shadow-md hover:border-charcoal-muted/30 focus:outline-none focus:ring-2 focus:ring-teal/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              {card.label}
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border ${card.accent}`} />
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal tracking-tight">
            {card.value}
          </p>
          <p className="text-[11px] text-charcoal-muted mt-1 truncate">
            {card.description}
          </p>
        </button>
      ))}
    </div>
  );
}

export default StatCards;
