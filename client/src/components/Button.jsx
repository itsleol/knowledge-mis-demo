export default function Button({ as: Component = "button", variant = "primary", className = "", children, ...props }) {
  return (
    <Component className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
