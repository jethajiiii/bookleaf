const VARIANT_STYLES = {
  primary: 'bg-ink-900 text-cream-100 hover:bg-terracotta-600 shadow-sm',
  secondary: 'bg-cream-100 text-ink-900 border border-cream-300 hover:bg-cream-200',
  outline: 'border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-100',
  ghost: 'text-ink-600 hover:bg-cream-200/60',
  danger: 'bg-terracotta-600 text-cream-100 hover:bg-terracotta-700',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

/**
 * Reusable editorial-style button component.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const vStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const sStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-full tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${vStyle} ${sStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

