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
 * Editorial TicketTable renders the operational queue table with priorities, author,
 * AI category tags, status, age with overdue warning, and archival curators.
 */
export function TicketTable({ tickets = [], onSelectTicket }) {
  return (
    <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl overflow-hidden shadow-soft-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF5EE] border-b border-[#E5DCCE] text-[10px] font-sans font-semibold text-[#55433c] uppercase tracking-widest">
              <th className="py-3.5 px-5">Priority</th>
              <th className="py-3.5 px-5">Folio / Subject</th>
              <th className="py-3.5 px-5">Author</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Age</th>
              <th className="py-3.5 px-5">Curator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5DCCE]/70">
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
                  className="hover:bg-[#FAF5EE]/80 transition-colors cursor-pointer group"
                >
                  {/* Priority Pill */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <Badge variant={priorityVariant}>{priorityLabel}</Badge>
                  </td>

                  {/* # / Subject */}
                  <td className="py-4 px-5 min-w-[220px] max-w-[340px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#55433c]/80 tracking-wider">
                        #{t.ticketNo || t._id.slice(-6)}
                      </span>
                    </div>
                    <p className="font-editorial text-base text-[#2B2622] font-semibold truncate group-hover:text-[#984221] transition-colors leading-snug">
                      {t.subject}
                    </p>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <p className="font-sans font-semibold text-[#2B2622] text-xs">
                      {t.authorName || 'Unknown'}
                    </p>
                    {t.author?.authorCode && (
                      <span className="font-mono text-[10px] text-[#55433c]/70 block">
                        {t.author.authorCode}
                      </span>
                    )}
                  </td>

                  {/* Category Tag with AI Sparkle Icon */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#3F7F8C]/10 text-[#3F7F8C] border border-[#3F7F8C]/20">
                      {hasAiCategory && (
                        <svg className="w-3 h-3 text-[#3F7F8C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
                        </svg>
                      )}
                      <span>{categoryLabel}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>

                  {/* Age (with warning style when overdue 3d+) */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    {overdue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#984221]/10 text-[#984221] border border-[#984221]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#984221] animate-pulse" />
                        {formatTicketAge(t.ageInHours)} (3d+)
                      </span>
                    ) : (
                      <span className="text-[#55433c] font-mono text-[11px]">
                        {formatTicketAge(t.ageInHours)}
                      </span>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    {t.assignedToName ? (
                      <span className="text-[#2B2622] font-medium text-xs font-sans">
                        {t.assignedToName}
                      </span>
                    ) : (
                      <span className="italic text-[#55433c]/60 text-[11px] font-editorial">
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
