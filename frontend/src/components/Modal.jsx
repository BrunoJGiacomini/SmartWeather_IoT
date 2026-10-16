import { useEffect } from "react";
import { useUi } from "../context/useUi.js";

function Modal() {
  const { isModalOpen, modalContent, closeModal } = useUi();

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, closeModal]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div
      className={`mo${isModalOpen ? " on" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="mb" role="dialog" aria-modal="true">
        {modalContent}
      </div>
    </div>
  );
}

export default Modal;