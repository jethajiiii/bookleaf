/**
 * Warm animated loading spinner component.
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size] || 'w-8 h-8 border-3';

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-terracotta border-t-transparent ${sizeClasses} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;
