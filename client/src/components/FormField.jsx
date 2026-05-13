export default function FormField({ label, helper, error, children, className = "" }) {
  return (
    <label className={`form-field ${className}`.trim()}>
      <span>{label}</span>
      {children}
      {helper && <small>{helper}</small>}
      {error && <em>{error}</em>}
    </label>
  );
}
