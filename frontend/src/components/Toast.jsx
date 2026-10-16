import { useUi } from "../context/useUi.js";

function Toast() {
  const { toast } = useUi();

  return (
    <div
      className="toast"
      role="status"
      style={{ display: toast.visible ? "block" : "none" }}
    >
      {toast.message}
    </div>
  );
}

export default Toast;