
import { useUi } from "../context/useUi.js";
import { FiCheckCircle } from "react-icons/fi";

function Toast() {
  const { toast } = useUi();

  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      style={{ display: toast.visible ? "flex" : "none" }}
    >
      <FiCheckCircle
        className="toast-icon"
        aria-hidden="true"
      />

      <span className="toast-message">
        {toast.message}
      </span>
    </div>
  );
}

export default Toast;
