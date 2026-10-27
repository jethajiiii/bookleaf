import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAdminTickets } from '../../api/admin.api.js';
import { usePolling } from '../../hooks/usePolling.js';
import { useQueueParams } from './useQueueParams.js';
import StatCards from './StatCards.jsx';
import QueueFilters from './QueueFilters.jsx';
import TicketTable from './TicketTable.jsx';
import Pagination from './Pagination.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';

const POLL_INTERVAL = 10000;

/**
 * Editorial TicketQueuePage renders the main admin ticket queue with stats, URL-bound filters,
 * table listing, pagination, and silent 10s polling.
 */
export function TicketQueuePage() {
  const navigate = useNavigate();
  const {
    searchParams,
    setSearchParams,
    currentPage,
    filterParams,
    setFilter,
    resetFilters,
    setPage,
  } = useQueueParams();

  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        getAdminStats(),
        getAdminTickets(filterParams),
      ]);

      setStats(statsRes || {});
      setTickets(ticketsRes?.tickets || []);
      setTotal(ticketsRes?.total || 0);
      setTotalPages(ticketsRes?.totalPages || 1);
      setError(null);
    } catch (err) {
      if (isFirstLoad.current) setError(err.message || 'Failed to load tickets');
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, [filterParams]);

  usePolling(fetchData, POLL_INTERVAL, true);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-xs uppercase tracking-widest text-[#55433c] font-mono">
          Retrieving Archival Dispatch Queue...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-[#FCF9F5] border border-[#984221]/30 rounded-2xl text-center space-y-4 shadow-soft-card">
        <p className="text-sm text-[#2B2622]">{error}</p>
        <Button variant="primary" size="md" onClick={fetchData}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCCE] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#3F7F8C]/10 border border-[#3F7F8C]/20 text-[#3F7F8C] text-[10px] font-sans font-semibold uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F7F8C]" />
            <span>Curatorial Dispatch &amp; Operations</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-[#2B2622] tracking-tight">
            Literary Folio <span className="font-display-italic text-[#3F7F8C]">Queue</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#55433c] mt-1 font-display-italic">
            Prioritized curatorial register for author inquiries, royalties, and manuscript dispute resolution.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#E5DCCE] text-[11px] text-[#55433c] font-medium shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Live Atelier Sync (10s)</span>
        </span>
      </div>

      <StatCards
        stats={stats}
        onSelectCard={(filters) => setSearchParams(new URLSearchParams(filters))}
      />

      <QueueFilters
        searchParams={searchParams}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      {tickets.length === 0 ? (
        <EmptyState
          title="No folios match this filter"
          description="Adjust your search criteria, status, or date range to view other dispatches."
          action={<Button variant="outline" size="sm" onClick={resetFilters}>Clear Filters</Button>}
        />
      ) : (
        <>
          <TicketTable
            tickets={tickets}
            onSelectTicket={(t) => navigate(`/admin/tickets/${t._id}`)}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default TicketQueuePage;
