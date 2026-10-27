import { STATUS_TABS } from './ticketUtils.js';

/**
 * Filter tabs component for ticket statuses with item counts.
 *
 * @param {Object} props
 * @param {string} props.activeTab Currently active tab key
 * @param {Function} props.onSelectTab Callback when a tab is clicked
 * @param {Array} props.tickets Full list of tickets for calculating counts
 */
export function TicketFilterTabs({ activeTab, onSelectTab, tickets = [] }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {STATUS_TABS.map((tab) => {
        const count =
          tab.key === 'all'
            ? tickets.length
            : tickets.filter((t) => t.status === tab.key).length;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
              isActive
                ? 'bg-terracotta text-white shadow-sm'
                : 'bg-card border border-card-border text-charcoal-light hover:text-charcoal'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 ${isActive ? 'text-white/70' : 'text-charcoal-muted'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default TicketFilterTabs;
