import { useEffect } from "react";
import { useUi } from "../context/useUi.js";

function Drawer() {
  const { isDrawerOpen, drawerContent, closeDrawer } = useUi();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <aside
      className={`drawer${isDrawerOpen ? " on" : ""}`}
      aria-label="Detalhes"
    >
      {drawerContent}
    </aside>
  );
}

export default Drawer;