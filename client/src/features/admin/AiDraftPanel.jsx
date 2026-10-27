import { useState, useEffect, useRef, useCallback } from 'react';
import { getTicketDraft, regenerateTicketDraft, retryTicketClassification } from '../../api/admin.api.js';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

/**
 * Editorial AiDraftPanel renders the AI-assisted response drafting card with editable textarea,
 * regenerate action, unavailable fallback banner, and direct reply dispatch.
 */
export function AiDraftPanel({ ticketId, aiStatus: _aiStatus, onSendReply }) {
  const [draftText, setDraftText] = useState('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const hasUserEdited = useRef(false);

  const fetchDraft = useCallback(async (force = false) => {
    try {
      if (force) setRegenerating(true);
      else setLoading(true);

      const res = force ? await regenerateTicketDraft(ticketId) : await getTicketDraft(ticketId);

      if (res?.draft) {
        setDraftText(res.draft);
        hasUserEdited.current = false;
        setUnavailable(false);
      } else {
        setUnavailable(true);
      }
    } catch {
      setUnavailable(true);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) fetchDraft(false);
  }, [ticketId, fetchDraft]);

  const handleRetryAi = async () => {
    try {
      setLoading(true);
      await retryTicketClassification(ticketId);
      await fetchDraft(true);
    } catch {
      setUnavailable(true);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = draftText.trim();
    if (!text) return;
    setSending(true);
    try {
      await onSendReply(text);
      setDraftText('');
      hasUserEdited.current = false;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 space-y-4 shadow-soft-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3F7F8C]">
          <span className="w-2 h-2 rounded-full bg-[#3F7F8C]" />
          <span className="font-editorial text-sm font-semibold tracking-wide">
            Curatorial Intelligence Draft • Review before dispatching
          </span>
        </div>
        {!unavailable && !loading && (
          <Button
            variant="ghost"
            size="sm"
            disabled={regenerating || sending}
            onClick={() => fetchDraft(true)}
            className="text-[11px] text-[#55433c] hover:text-[#3F7F8C] font-mono"
          >
            {regenerating ? 'Composing...' : '↻ Regenerate'}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 gap-3 text-xs text-[#55433c]">
          <Spinner size="sm" />
          <span className="font-display-italic">Composing literary response with author archive data...</span>
        </div>
      ) : unavailable ? (
        <div className="p-4 rounded-xl bg-[#FAF5EE] border border-amber-300/40 flex items-center justify-between text-xs text-[#2B2622]">
          <span className="font-display-italic">AI draft currently unavailable — compose manual reply below</span>
          <Button variant="outline" size="sm" onClick={handleRetryAi}>
            Retry AI
          </Button>
        </div>
      ) : null}

      {/* Editable textarea */}
      <textarea
        rows={5}
        value={draftText}
        onChange={(e) => {
          setDraftText(e.target.value);
          hasUserEdited.current = true;
        }}
        placeholder="Type or refine official folio response to author..."
        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DCCE] bg-[#FAF5EE] text-[#2B2622] resize-none focus:outline-none focus:border-[#3F7F8C] focus:ring-1 focus:ring-[#3F7F8C] leading-relaxed font-sans placeholder:text-[#55433c]/40"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-[#55433c] font-mono">
          {draftText.length} characters • Dispatches to author folio &amp; registered email
        </span>
        <Button
          variant="primary"
          size="md"
          disabled={sending || !draftText.trim()}
          onClick={handleSend}
          className="rounded-full bg-[#3F7F8C] hover:bg-[#346B76] text-white font-editorial tracking-wide cursor-pointer text-sm"
        >
          {sending ? 'Dispatching...' : 'Dispatch Reply →'}
        </Button>
      </div>
    </div>
  );
}

export default AiDraftPanel;
