/** Scroll wrapper plus table. Pass <thead> and <tbody> as children. */
export default function Table({ caption, children, className = '' }) {
  return (
    <div className="table-wrap">
      <table className={`table ${className}`}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}
