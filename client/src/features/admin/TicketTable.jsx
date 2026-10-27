import Badge from '../../components/ui/Badge.jsx';
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  PRIORITY_BADGE_VARIANTS,
  TICKET_STATUS_LABELS,
} from '../../lib/constants.js';
import { formatTicketAge, isTicketOverdue } from '../../lib/formatters.js';

const STATUS_VARIANTS = {
  open: 'teal',
  in_progress: 'mustard',
  resolved: 'sage',
  closed: 'neutral',
};

/**
 * TicketTable renders the operational queue table with priorities, author,
 * AI category tags, status, age with overdue warning, and assignees.
 */
export function TicketTable({ tickets = [], onSelectTicket }) {
  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-cream-dark/50 border-b border-card-border text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4"># / Subject</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {tickets.map((t) => {
              const priorityVariant = PRIORITY_BADGE_VARIANTS[t.priority] || 'neutral';
              const priorityLabel = PRIORITY_LABELS[t.priority] || t.priority;
              const statusVariant = STATUS_VARIANTS[t.status] || 'neutral';
              const statusLabel = TICKET_STATUS_LABELS[t.status] || t.status;
              const categoryLabel = CATEGORY_LABELS[t.category] || t.category;
              const overdue = isTicketOverdue(t);
              const hasAiCategory = Boolean(t.ai?.category || t.category);

              return (
                <tr
                  key={t._id}
                  onClick={() => onSelectTicket?.(t)}
                  className="hover:bg-cream-dark/20 transition-colors cursor-pointer"
                >
                  {/* Priority Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={priorityVariant}>{priorityLabel}</Badge>
                  </td>

                  {/* # / Subject */}
                  <td className="py-3.5 px-4 min-w-[200px] max-w-[320px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-charcoal-muted">
                        #{t.ticketNo || t._id.slice(-6)}
                      </span>
                    </div>
                    <p className="font-medium text-charcoal text-xs truncate hover:text-teal transition-colors">
                      {t.subject}
                    </p>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-medium text-charcoal">{t.authorName || 'Unknown'}</p>
                    {t.author?.authorCode && (
                      <span className="font-mono text-[10px] text-charcoal-muted">
                        {t.author.authorCode}
                      </span>
                    )}
                  </td>

                  {/* Category Tag with AI Sparkle Icon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-light text-teal border border-teal/30">
                      {hasAiCategory && (
                        <svg className="w-3 h-3 text-teal shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
                        </svg>
                      )}
                      <span>{categoryLabel}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>

                  {/* Age (with warning style when overdue 3d+) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {overdue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-terracotta-light text-terracotta border border-terracotta/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                        {formatTicketAge(t.ageInHours)} (3d+)
                      </span>
                    ) : (
                      <span className="text-charcoal-muted font-medium">
                        {formatTicketAge(t.ageInHours)}
                      </span>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {t.assignedToName ? (
                      <span className="text-charcoal font-medium">
                        {t.assignedToName}
                      </span>
                    ) : (
                      <span className="italic text-charcoal-muted/80 text-[11px]">
                        Unassigned
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketTable;
