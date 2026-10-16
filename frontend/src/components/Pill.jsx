function Pill({ variant, className = "", children, ...props }) {
  const variantClass = variant ? ` ${variant}` : "";
  const classes = `pill${variantClass}${className ? ` ${className}` : ""}`;
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Pill;