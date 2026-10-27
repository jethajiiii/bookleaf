import { useRef, useEffect } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import MessageThread from './MessageThread.jsx';
import ReplyBox from './ReplyBox.jsx';
import { formatDate } from '../../lib/formatters.js';
import { STATUS_CONFIG, hasNewReplies, getLastSeen, markSeen } from './ticketUtils.js';

/**
 * TicketCard renders a single ticket header, expandable conversation thread,
 * "New reply" badge, and reply input — styled with the editorial theme.
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
    <div className="bg-cream-50 border border-cream-300 rounded-lg overflow-hidden transition-all duration-200 hover:border-ink-800 hover:shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-6 py-4 flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-ink-400 tracking-wider">
              #{ticket.ticketNo || ticket._id.slice(-6)}
            </span>
            <Badge variant={cfg.badgeVariant}>{cfg.label}</Badge>
            {showNewBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-terracotta-600 text-cream-100 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-100 inline-block animate-pulse" />
                New reply
              </span>
            )}
          </div>
          <p className="font-serif text-base font-normal text-ink-900 truncate pr-4">
            {ticket.subject}
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] text-ink-400 font-mono">
            <span>{formatDate(ticket.createdAt)}</span>
            {ticket.book && (
              <span className="truncate">
                Book: <span className="font-medium text-ink-600">{ticket.book.title}</span>
              </span>
            )}
            <span>
              {ticket.messages?.length ?? 0}{' '}
              {ticket.messages?.length !== 1 ? 'messages' : 'message'}
            </span>
          </div>
        </div>
        <span
          className={`text-ink-400 transition-transform duration-200 mt-1 shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-cream-300 px-6 pb-5">
          <div
            ref={threadRef}
            className="max-h-72 overflow-y-auto pr-1 mt-3"
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
