import { formatDate } from '../../lib/formatters.js';

/**
 * Chat-style message thread for a ticket conversation.
 * Shows author messages on the right, admin/support on the left.
 * Never exposes internal notes, priority, or AI fields.
 *
 * @param {Object} props
 * @param {Array} props.messages Array of message objects from the ticket
 */
export function MessageThread({ messages = [] }) {
  if (messages.length === 0) {
    return (
      <p className="text-xs text-charcoal-muted italic text-center py-3">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 py-2">
      {messages.map((msg, idx) => {
        const isAuthor = msg.sender === 'author';
        return (
          <div
            key={msg._id || idx}
            className={`flex ${isAuthor ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isAuthor
                  ? 'bg-terracotta text-white rounded-br-sm'
                  : 'bg-cream border border-card-border text-charcoal rounded-bl-sm'
              }`}
            >
              {!isAuthor && (
                <p className="text-[10px] font-bold text-teal mb-1 uppercase tracking-wider">
                  {msg.senderName || 'BookLeaf Support'}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              <p
                className={`text-[10px] mt-1 ${
                  isAuthor ? 'text-white/60 text-right' : 'text-charcoal-muted text-left'
                }`}
              >
                {formatDate(msg.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageThread;
