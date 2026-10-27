import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getAdminTicketById,
  updateAdminTicket,
  addAdminReply,
  addInternalNote,
} from '../../api/admin.api.js';
import { usePolling } from '../../hooks/usePolling.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatTicketAge, isTicketOverdue, formatDate } from '../../lib/formatters.js';
import MessageThread from '../tickets/MessageThread.jsx';
import AiDraftPanel from './AiDraftPanel.jsx';
import TicketControls from './TicketControls.jsx';
import BookSnapshot from './BookSnapshot.jsx';
import InternalNotes from './InternalNotes.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Button from '../../components/ui/Button.jsx';

const POLL_INTERVAL = 10000;

/**
 * Editorial TicketDetailPage provides the two-column operational workspace for ticket triage,
 * thread inspection, AI draft review, book verification, and internal team notes.
 */
export function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  const fetchTicket = useCallback(async () => {
    try {
      const data = await getAdminTicketById(id);
      setTicket(data);
      setError(null);
    } catch (err) {
      if (isFirstLoad.current) setError(err.message || 'Failed to load ticket');
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, [id]);

  useEffect(() => {
    isFirstLoad.current = true;
    fetchTicket();
  }, [fetchTicket]);

  usePolling(fetchTicket, POLL_INTERVAL, true);

  const handleSendReply = async (body) => setTicket(await addAdminReply(id, body));
  const handleUpdate = async (up) => setTicket(await updateAdminTicket(id, up));
  const handleAddNote = async (body) => setTicket(await addInternalNote(id, body));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-xs uppercase tracking-widest text-[#55433c] font-mono">
          Loading Archival Dispatch Workspace...
        </p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-[#FCF9F5] border border-[#984221]/30 rounded-2xl text-center space-y-4 shadow-soft-card">
        <p className="text-sm text-[#2B2622]">{error || 'Folio dispatch not found'}</p>
        <Link to="/admin">
          <Button variant="outline" size="sm">
            Back to Queue
          </Button>
        </Link>
      </div>
    );
  }

  const overdue = isTicketOverdue(ticket);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Ticket Header */}
      <div className="border-b border-[#E5DCCE] pb-5 space-y-2">
        <Link
          to="/admin"
          className="text-xs text-[#3F7F8C] font-semibold hover:underline inline-flex items-center gap-1 font-editorial tracking-wide"
        >
          ← Back to Folio Queue
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-[#55433c] bg-[#FAF5EE] px-2 py-0.5 rounded border border-[#E5DCCE]">
                #{ticket.ticketNo || ticket._id.slice(-6)}
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-[#2B2622] tracking-tight">
                {ticket.subject}
              </h1>
            </div>
            <p className="text-xs text-[#55433c] mt-1 font-sans">
              Author: <span className="font-semibold text-[#2B2622]">{ticket.authorName}</span>
              {ticket.author?.email && ` (${ticket.author.email})`} • Dispatched {formatDate(ticket.createdAt)}
            </p>
          </div>
          {overdue && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#984221]/10 text-[#984221] border border-[#984221]/30 self-start">
              <span className="w-2 h-2 rounded-full bg-[#984221] animate-pulse" />
              Unresolved 3+ Days ({formatTicketAge(ticket.ageInHours)})
            </span>
          )}
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversation Thread & AI Draft */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 shadow-soft-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DCCE] pb-3">
              <h2 className="font-editorial text-xl font-normal text-[#2B2622] tracking-tight">
                Folio Conversation <span className="font-display-italic text-[#984221]">Thread</span>
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-[#55433c] font-mono">
                {ticket.messages?.length || 0} Entries
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto pr-1">
              <MessageThread messages={ticket.messages || []} />
            </div>
          </div>
          <AiDraftPanel ticketId={ticket._id} aiStatus={ticket.ai?.status} onSendReply={handleSendReply} />
        </div>

        {/* Right Column: Controls, Book Snapshot, Internal Notes */}
        <div className="lg:col-span-5 space-y-6">
          <TicketControls ticket={ticket} currentUserId={user?._id || user?.id} onUpdateTicket={handleUpdate} />
          <BookSnapshot book={ticket.bookSnapshot || ticket.book} />
          <InternalNotes notes={ticket.internalNotes || []} onAddNote={handleAddNote} />
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
