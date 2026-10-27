import { useRef, useEffect } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import MessageThread from './MessageThread.jsx';
import ReplyBox from './ReplyBox.jsx';
import { formatDate } from '../../lib/formatters.js';
import { STATUS_CONFIG, hasNewReplies, getLastSeen, markSeen } from './ticketUtils.js';

/**
 * TicketCard renders a single ticket header, expandable conversation thread,
 * "New reply" badge, and reply input.
 *
 * @param {Object} props
 * @param {Object} props.ticket Ticket document (author-safe)
 * @param {boolean} props.isExpanded Controlled expansion state
 * @param {Function} props.onToggle Called when header is clicked
 * @param {Function} props.onTicketUpdate Called with updated ticket after a reply
 */
export function TicketCard({ ticket, isExpanded, onToggle, onTicketUpdate }) {
  const lastSeen = getLastSeen(ticket._id);
  const showNewBadge = !isExpanded && hasNewReplies(ticket, lastSeen);
  const threadRef = useRef(null);
  const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;

  useEffect(() => {
    if (!isExpanded) return;
    markSeen(ticket._id);
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [isExpanded, ticket._id]);

  useEffect(() => {
    if (!isExpanded || !threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [isExpanded, ticket.messages?.length]);

  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-charcoal-muted">
              #{ticket.ticketNo || ticket._id.slice(-6)}
            </span>
            <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
            {showNewBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
                New reply
              </span>
            )}
          </div>
          <p className="font-semibold text-charcoal text-sm truncate pr-4">{ticket.subject}</p>
          <div className="flex flex-wrap gap-3 text-[11px] text-charcoal-muted">
            <span>{formatDate(ticket.createdAt)}</span>
            {ticket.book && (
              <span className="truncate">
                Book: <span className="font-medium text-charcoal">{ticket.book.title}</span>
              </span>
            )}
            <span>
              {ticket.messages?.length ?? 0} message{ticket.messages?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <span
          className={`text-charcoal-muted transition-transform duration-200 mt-1 shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-card-border px-5 pb-4">
          <div
            ref={threadRef}
            className="max-h-72 overflow-y-auto pr-1 mt-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            <MessageThread messages={ticket.messages || []} />
          </div>
          <ReplyBox ticket={ticket} onReplySent={onTicketUpdate} />
        </div>
      )}
    </div>
  );
}

export default TicketCard;
