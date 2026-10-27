import { useState } from 'react';
import { addTicketMessage } from '../../api/tickets.api.js';
import Button from '../../components/ui/Button.jsx';

/**
 * Author reply box. Disabled when ticket is closed.
 * Explains that replying to a resolved ticket reopens it.
 *
 * @param {Object} props
 * @param {Object} props.ticket
 * @param {Function} props.onReplySent
 */
export function ReplyBox({ ticket, onReplySent }) {
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const isClosed = ticket.status === 'closed';

  const handleSend = async () => {
    const text = body.trim();
    if (!text) return;
    setSending(true);
    setError(null);
    try {
      const updated = await addTicketMessage(ticket._id, text);
      setBody('');
      onReplySent(updated);
    } catch (err) {
      setError(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (isClosed) {
    return (
      <p className="text-xs text-charcoal-muted italic text-center py-2 border-t border-card-border mt-3">
        This ticket is closed and no longer accepts replies.
      </p>
    );
  }

  return (
    <div className="border-t border-card-border mt-3 pt-3 space-y-2">
      {ticket.status === 'resolved' && (
        <p className="text-xs text-mustard-dark bg-mustard-light/50 px-2.5 py-1 rounded-md border border-mustard/30 inline-block font-medium">
          This ticket is resolved. Sending a reply will reopen it.
        </p>
      )}
      <textarea
        rows={2}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your reply..."
        className="w-full px-3 py-2 text-sm rounded-xl border border-card-border bg-cream-light text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
      {error && <p className="text-xs text-terracotta font-medium">{error}</p>}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          disabled={sending || !body.trim()}
          onClick={handleSend}
        >
          {sending ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
}

export default ReplyBox;
