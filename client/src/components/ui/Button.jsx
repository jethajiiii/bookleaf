const VARIANT_STYLES = {
  primary: 'bg-terracotta text-white hover:bg-terracotta-hover shadow-sm',
  secondary: 'bg-card text-charcoal border border-card-border hover:bg-cream-light',
  outline: 'border border-terracotta text-terracotta hover:bg-terracotta-light',
  ghost: 'text-charcoal hover:bg-cream-dark/40',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

/**
 * Reusable pill-shaped button component.
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
      className={`inline-flex items-center justify-center font-medium rounded-pill transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${vStyle} ${sStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
