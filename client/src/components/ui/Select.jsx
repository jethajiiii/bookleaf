/**
 * Reusable select dropdown component with label and error display.
 */
export function Select({
  label,
  error,
  helperText,
  id,
  options = [],
  children,
  className = '',
  required = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-terracotta">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-charcoal bg-cream-light appearance-none pr-10 transition-all duration-150 focus:outline-none focus:ring-2 cursor-pointer ${
            error
              ? 'border-terracotta focus:border-terracotta focus:ring-terracotta/20 bg-terracotta-light/20'
              : 'border-card-border focus:border-terracotta focus:ring-terracotta/30'
          } ${className}`}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value ?? 'empty'} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>

        {/* Custom chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-terracotta font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-charcoal-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Select;
