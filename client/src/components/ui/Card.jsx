/**
 * Reusable Card component adhering to BookLeaf Stitch editorial design tokens.
 */
export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-soft-card transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
