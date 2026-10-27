import { useEffect } from 'react';

/**
 * Toast notification banner for user feedback.
 */
export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000,
  className = '',
}) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-sage-dark text-white border-sage',
    error: 'bg-terracotta text-white border-terracotta',
    info: 'bg-teal text-white border-teal',
  }[type] || 'bg-charcoal text-white border-card-border';

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${bgStyles} ${className}`}
    >
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white text-base font-bold leading-none p-1"
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;
