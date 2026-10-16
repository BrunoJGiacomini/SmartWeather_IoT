function Chip({ pressed, onClick, children, style, className = "", ...props }) {
  const classes = `chip${className ? ` ${className}` : ""}`;
  return (
    <button
      type="button"
      className={classes}
      aria-pressed={pressed ? "true" : "false"}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

export default Chip;