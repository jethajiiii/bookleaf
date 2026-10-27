/**
 * Reusable form input component with editorial styling and design tokens.
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
          className="block text-[11px] font-sans font-semibold text-[#55433c] uppercase tracking-widest mb-1.5"
        >
          {label} {required && <span className="text-[#984221]">*</span>}
        </label>
      )}

      <input
        id={inputId}
        required={required}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#2B2622] bg-[#FAF5EE] transition-all duration-150 placeholder:text-[#55433c]/40 font-sans focus:outline-none focus:ring-1 ${
          error
            ? 'border-[#984221] focus:border-[#984221] focus:ring-[#984221]/20 bg-red-50/50'
            : 'border-[#E5DCCE] focus:border-[#984221] focus:ring-[#984221]'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-[#984221] font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-[#55433c]/70 font-display-italic">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
