import { useSearchParams } from 'react-router-dom';

/**
 * Hook managing URL search parameters for admin queue filters and pagination.
 */
export function useQueueParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const filterParams = {
    status: searchParams.get('status') || undefined,
    category: searchParams.get('category') || undefined,
    priority: searchParams.get('priority') || undefined,
    from: searchParams.get('from') || undefined,
    to: searchParams.get('to') || undefined,
    assigned: searchParams.get('assigned') || undefined,
    page: currentPage,
    limit: 20,
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  const resetFilters = () => setSearchParams(new URLSearchParams());

  const setPage = (newPage) => {
    const next = new URLSearchParams(searchParams);
    if (newPage <= 1) next.delete('page');
    else next.set('page', String(newPage));
    setSearchParams(next);
  };

  return {
    searchParams,
    setSearchParams,
    currentPage,
    filterParams,
    setFilter,
    resetFilters,
    setPage,
  };
}

export default useQueueParams;
