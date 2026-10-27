import { useState } from 'react';
import {
  TICKET_STATUS,
  TICKET_STATUS_LABELS,
  CATEGORIES,
  CATEGORY_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
} from '../../lib/constants.js';
import Button from '../../components/ui/Button.jsx';

/**
 * Editorial TicketControls provides admin lifecycle controls: Status, Category, Priority, and Assignment.
 * Displays "AI suggested: X" badges when AI classification exists.
 */
export function TicketControls({ ticket, currentUserId, onUpdateTicket }) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (field, value) => {
    setUpdating(true);
    try {
      await onUpdateTicket({ [field]: value });
    } finally {
      setUpdating(false);
    }
  };

  const isAssignedToMe = ticket.assignedTo === currentUserId || ticket.assignedTo?._id === currentUserId;

  return (
    <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 space-y-4 shadow-soft-card">
      <h3 className="font-editorial text-lg font-normal text-[#2B2622] tracking-tight border-b border-[#E5DCCE] pb-3">
        Folio Controls &amp; Management
      </h3>

      {/* Status Select */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#55433c]">
          Resolution Status
        </label>
        <select
          disabled={updating}
          value={ticket.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all font-sans"
        >
          {Object.values(TICKET_STATUS).map((s) => (
            <option key={s} value={s}>
              {TICKET_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Category Select with AI Suggested */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#55433c]">
            Category
          </label>
          {ticket.ai?.category && (
            <span className="text-[10px] text-[#3F7F8C] font-mono bg-[#3F7F8C]/10 px-2 py-0.5 rounded-full border border-[#3F7F8C]/20">
              AI: {CATEGORY_LABELS[ticket.ai.category] || ticket.ai.category}
            </span>
          )}
        </div>
        <select
          disabled={updating}
          value={ticket.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all font-sans"
        >
          {Object.values(CATEGORIES).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Select with AI Suggested */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#55433c]">
            Urgency Priority
          </label>
          {ticket.ai?.priority && (
            <span className="text-[10px] text-[#984221] font-mono bg-[#984221]/10 px-2 py-0.5 rounded-full border border-[#984221]/20">
              AI: {PRIORITY_LABELS[ticket.ai.priority] || ticket.ai.priority}
            </span>
          )}
        </div>
        <select
          disabled={updating}
          value={ticket.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] transition-all font-sans"
        >
          {Object.values(PRIORITIES).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      {/* Assignment Control */}
      <div className="pt-3 border-t border-[#E5DCCE] flex items-center justify-between">
        <div>
          <span className="block text-[10px] text-[#55433c] uppercase font-semibold tracking-wider">
            Assigned Curator
          </span>
          <span className="text-xs font-semibold text-[#2B2622] font-sans">
            {ticket.assignedToName || 'Unassigned'}
          </span>
        </div>
        {isAssignedToMe ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={updating}
            onClick={() => handleChange('assignedTo', null)}
            className="text-[11px] text-[#984221] hover:underline cursor-pointer"
          >
            Release Assignment
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={updating}
            onClick={() => handleChange('assignedTo', 'me')}
            className="text-xs font-medium rounded-full cursor-pointer"
          >
            Claim Folio
          </Button>
        )}
      </div>
    </div>
  );
}

export default TicketControls;
