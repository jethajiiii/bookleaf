/**
 * Editorial animated loading spinner.
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  }[size] || 'w-8 h-8 border-2';

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-ink-900 border-t-transparent ${sizeClasses} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;

