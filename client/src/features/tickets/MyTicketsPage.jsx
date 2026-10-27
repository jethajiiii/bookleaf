import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets } from '../../api/tickets.api.js';
import { usePolling } from '../../hooks/usePolling.js';
import TicketCard from './TicketCard.jsx';
import TicketFilterTabs from './TicketFilterTabs.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const POLL_INTERVAL = 5000;

/**
 * MyTicketsPage renders author tickets with silent polling, status filters,
 * and expandable conversation cards.
 */
export function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();

  const mergeTickets = useCallback((fresh) => {
    setTickets((prev) => {
      if (prev.length === 0) return fresh;
      const hasChanges =
        prev.length !== fresh.length ||
        fresh.some((f, idx) => {
          const p = prev[idx];
          return (
            !p ||
            p._id !== f._id ||
            p.status !== f.status ||
            p.messages?.length !== f.messages?.length
          );
        });

      if (!hasChanges) return prev;

      const map = new Map(prev.map((t) => [t._id, t]));
      fresh.forEach((t) => map.set(t._id, t));
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const fresh = await getMyTickets();
      mergeTickets(fresh);
      setError(null);
    } catch (err) {
      if (isFirstLoad.current) setError(err.message || 'Failed to load tickets');
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, [mergeTickets]);

  usePolling(fetchTickets, POLL_INTERVAL, true);

  const handleToggle = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleTicketUpdate = useCallback((updated) => {
    setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  }, []);

  const filtered =
    activeTab === 'all'
      ? tickets
      : tickets.filter((t) => t.status === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-charcoal-light">Loading your support tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-card border border-terracotta/30 rounded-2xl text-center space-y-4">
        <p className="text-sm text-charcoal-light">{error}</p>
        <Button variant="primary" size="md" onClick={fetchTickets}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal tracking-tight">
            Support Tickets
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Track your queries and communicate with the support team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-dark/50 border border-card-border text-[11px] text-charcoal-light font-medium">
            <span className="w-2 h-2 rounded-full bg-sage inline-block animate-pulse" />
            Live
          </span>
          <Button variant="primary" size="sm" onClick={() => navigate('/tickets/new')}>
            + New Query
          </Button>
        </div>
      </div>

      <TicketFilterTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tickets={tickets}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={activeTab === 'all' ? 'No support tickets yet' : `No ${activeTab.replace('_', ' ')} tickets`}
          description={
            activeTab === 'all'
              ? 'Submit a query to get assistance from the BookLeaf support team.'
              : 'No tickets match the selected filter.'
          }
          action={
            activeTab === 'all' ? (
              <Button variant="primary" size="md" onClick={() => navigate('/tickets/new')}>
                Submit a Query
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              isExpanded={expandedIds.has(ticket._id)}
              onToggle={() => handleToggle(ticket._id)}
              onTicketUpdate={handleTicketUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTicketsPage;
