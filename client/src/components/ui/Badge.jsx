const VARIANT_STYLES = {
  neutral: 'bg-cream-300/50 text-ink-600 border-cream-300',
  sage: 'bg-sage-500/10 text-sage-600 border-sage-500/30',
  mustard: 'bg-mustard-400/15 text-mustard-600 border-mustard-400/30 font-semibold',
  terracotta: 'bg-terracotta-500/10 text-terracotta-600 border-terracotta-500/30',
  teal: 'bg-dustyteal-500/10 text-dustyteal-600 border-dustyteal-500/30',
  ink: 'bg-ink-900 text-cream-100 border-ink-900',
};

/**
 * Reusable editorial pill chip/badge component.
 */
export function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;

