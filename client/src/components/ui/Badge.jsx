const VARIANT_STYLES = {
  neutral: 'bg-cream-dark/50 text-charcoal border-card-border',
  sage: 'bg-sage-light text-sage-dark border-sage/40',
  mustard: 'bg-mustard-light text-mustard-dark border-mustard/40 font-semibold',
  terracotta: 'bg-terracotta-light text-terracotta border-terracotta/40',
  teal: 'bg-teal-light text-teal border-teal/40',
};

/**
 * Reusable pill chip/badge component.
 */
export function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium border ${styles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
