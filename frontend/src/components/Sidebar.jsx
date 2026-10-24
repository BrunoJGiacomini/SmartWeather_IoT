import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useUi } from "../context/useUi.js";

const NAV_ITEMS = [
  { to: "/clima", label: "Clima" },
  { to: "/mapa", label: "Mapa de setores" },
  { to: "/os", label: "Ordens de serviço" },
  { to: "/equipamentos", label: "Equipamentos" },
  { to: "/alertas", label: "Alertas", badge: true },
  { to: "/app-campo", label: "App de campo" },
  { to: "/perfil", label: "Meu perfil" },
];

function Sidebar() {
  const { logout } = useAuth();
  const { alerts } = useUi();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav aria-label="Principal">
      <div className="logo">
        <span style={{ color: "var(--g)" }}>●</span> SmartWeather
      </div>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => (isActive ? "on" : "")}
        >
          {item.label}
          {item.badge && <span className="pill r">{alerts.length}</span>}
        </NavLink>
      ))}
      <div className="sp"></div>
      <button onClick={handleLogout}>Sair</button>
    </nav>
  );
}

export default Sidebar;