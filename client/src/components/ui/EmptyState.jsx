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
      className={`flex flex-col items-center justify-center p-12 text-center bg-card border border-card-border rounded-2xl ${className}`}
    >
      {icon && <div className="mb-4 text-charcoal-muted">{icon}</div>}
      <h3 className="font-serif text-xl font-medium text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-charcoal-light max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
