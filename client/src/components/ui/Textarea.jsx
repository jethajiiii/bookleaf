/**
 * Reusable multiline textarea component with label, error display, and character counter.
 */
export function Textarea({
  label,
  error,
  helperText,
  id,
  rows = 4,
  maxLength,
  value = '',
  className = '',
  required = false,
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider"
          >
            {label} {required && <span className="text-terracotta">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-charcoal-muted">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        required={required}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-charcoal bg-cream-light resize-y transition-all duration-150 placeholder:text-charcoal-muted focus:outline-none focus:ring-2 ${
          error
            ? 'border-terracotta focus:border-terracotta focus:ring-terracotta/20 bg-terracotta-light/20'
            : 'border-card-border focus:border-terracotta focus:ring-terracotta/30'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-terracotta font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-charcoal-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Textarea;
