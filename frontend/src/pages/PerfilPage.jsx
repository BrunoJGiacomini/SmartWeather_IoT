import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pill from "../components/Pill.jsx";
import Toggle from "../components/Toggle.jsx";
import { useAuth } from "../context/useAuth.js";

function PerfilPage() {
  const { role, theme, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="hd">
        <h1>Meu perfil</h1>
      </div>
      <div className="grid g2">
        <div className="card">
          <h2>Dados da conta</h2>
          <p style={{ marginTop: 12 }}>
            <b>Marina Souza</b>
            <br />
            <span className="mu">marina.souza@prefeitura.gov.br</span>
          </p>
          <p style={{ marginTop: 8 }}>
            <Pill variant="g">{role}</Pill>
          </p>
        </div>
        <div className="card">
          <h2>Preferências</h2>
          <div className="tg">
            <span>Tema escuro</span>
            <Toggle
              pressed={theme === "dark"}
              onChange={toggleTheme}
              aria-label="Alternar tema escuro"
            />
          </div>
          <div className="tg">
            <span>Notificações de alertas</span>
            <Toggle
              pressed={notifications}
              onChange={setNotifications}
              aria-label="Notificações"
            />
          </div>
          <button
            className="btn o"
            style={{
              marginTop: 18,
              color: "var(--r)",
              borderColor: "var(--r)",
            }}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
}

export default PerfilPage;