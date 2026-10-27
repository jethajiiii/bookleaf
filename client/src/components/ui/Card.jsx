/**
 * Reusable Card component adhering to BookLeaf design tokens.
 * Background #FBF7EF with 1px #E4D9C4 border.
 */
export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-card border border-card-border rounded-2xl p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
