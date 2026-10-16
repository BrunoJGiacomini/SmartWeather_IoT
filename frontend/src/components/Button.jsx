function Button({
  variant,
  className = "",
  type = "button",
  disabled,
  wide,
  children,
  ...props
}) {
  const classes = ["btn"];
  if (variant === "outline" || variant === "o") classes.push("o");
  if (wide) classes.push("w");
  if (className) classes.push(className);
  return (
    <button
      type={type}
      className={classes.join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;