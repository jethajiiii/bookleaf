import { useState, useCallback, useRef } from 'react';
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
 * TicketQueuePage renders the main admin ticket queue with stats, URL-bound filters,
 * table listing, pagination, and silent 10s polling.
 */
export function TicketQueuePage() {
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
        <p className="text-sm text-charcoal-light">Loading operational queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-card border border-terracotta/30 rounded-2xl text-center space-y-4">
        <p className="text-sm text-charcoal-light">{error}</p>
        <Button variant="primary" size="md" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal tracking-tight">
            Ticket Queue
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Prioritized operational inbox for author inquiries and dispute handling.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-cream-dark/50 border border-card-border text-[11px] text-charcoal-light font-medium">
          <span className="w-2 h-2 rounded-full bg-teal inline-block animate-pulse" />
          Live (10s sync)
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
          title="No tickets match this filter"
          description="Adjust your search criteria, status, or date range to view other tickets."
          action={<Button variant="outline" size="sm" onClick={resetFilters}>Clear Filters</Button>}
        />
      ) : (
        <>
          <TicketTable tickets={tickets} />
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
