function Toggle({ pressed, onChange, ...props }) {
  const handleClick = () => {
    if (onChange) onChange(!pressed);
  };
  return (
    <button
      type="button"
      className="tog"
      aria-pressed={pressed ? "true" : "false"}
      onClick={handleClick}
      {...props}
    />
  );
}

export default Toggle;