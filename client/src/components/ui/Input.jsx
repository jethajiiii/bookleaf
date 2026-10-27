/**
 * Reusable form input component with label, error display, and design tokens.
 */
export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}

      <input
        id={inputId}
        required={required}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-charcoal bg-cream-light transition-all duration-150 placeholder:text-charcoal-muted focus:outline-none focus:ring-2 ${
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

export default Input;
