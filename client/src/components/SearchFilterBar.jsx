export default function SearchFilterBar({ as: Component = "form", className = "", children, ...props }) {
  return (
    <Component className={`search-filter-bar ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
