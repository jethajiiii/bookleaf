/**
 * Reusable empty state view with title, description, and optional action.
 */
export function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action = null,
  icon = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-cream-100 border border-cream-300 rounded-lg ${className}`}
    >
      {icon && <div className="mb-4 text-ink-400">{icon}</div>}
      <h3 className="font-serif text-xl font-normal text-ink-900 mb-2">{title}</h3>
      <p className="text-sm text-ink-600 font-light max-w-md mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
