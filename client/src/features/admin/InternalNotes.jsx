import { useState } from 'react';
import { formatDate } from '../../lib/formatters.js';
import Button from '../../components/ui/Button.jsx';

/**
 * Editorial InternalNotes renders confidential curatorial notes with parchment styling,
 * lock badge, and internal team observations.
 */
export function InternalNotes({ notes = [], onAddNote }) {
  const [noteBody, setNoteBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const text = noteBody.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      await onAddNote(text);
      setNoteBody('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FCF9F5] border border-amber-300/40 rounded-2xl p-6 space-y-4 shadow-soft-card">
      <div className="flex items-center justify-between border-b border-[#E5DCCE] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C88C35]" />
          <h3 className="font-editorial text-base font-normal text-[#2B2622] tracking-tight">
            Curatorial Observations
          </h3>
        </div>
        <span className="text-[10px] text-[#C88C35] font-mono uppercase tracking-wider">
          Confidential • Staff Only
        </span>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-[#55433c] font-display-italic py-1">
            No internal observations recorded for this folio yet.
          </p>
        ) : (
          notes.map((n, i) => (
            <div
              key={n._id || i}
              className="p-3 rounded-xl bg-[#FAF5EE] border border-[#E5DCCE] text-xs text-[#2B2622] space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between text-[10px] text-[#55433c]">
                <span className="font-semibold text-[#2B2622] font-sans">{n.adminName || 'Admin'}</span>
                <span className="font-mono">{formatDate(n.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{n.body}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="pt-3 border-t border-[#E5DCCE] space-y-2.5">
        <textarea
          rows={2}
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          placeholder="Add confidential curatorial note..."
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] resize-none focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] placeholder:text-[#55433c]/40 font-sans"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={submitting || !noteBody.trim()}
            className="text-xs font-medium rounded-full cursor-pointer"
          >
            {submitting ? 'Recording...' : 'Record Observation'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InternalNotes;
