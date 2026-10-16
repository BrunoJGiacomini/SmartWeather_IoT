import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

function AppShell() {
  return (
    <div id="app">
      <Sidebar />
      <main id="main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;