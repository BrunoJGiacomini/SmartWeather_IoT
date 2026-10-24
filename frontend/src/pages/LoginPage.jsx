import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

const ROLES = [
  {
    value: "Gestor Municipal",
    title: "Gestor Municipal",
    description: "Painel e planejamento",
  },
  {
    value: "Fiscal Operacional",
    title: "Fiscal Operacional",
    description: "Campo e ordens",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [role, setRole] = useState("Gestor Municipal");

  // An authenticated visitor landing on the login URL (or reloading it) goes
  // straight back to the app instead of seeing the login form again.
  if (isAuthenticated) {
    return <Navigate to="/clima" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    login(role);
    navigate("/clima");
  };

  return (
    <section id="login">
      <div className="art">
        <b style={{ fontSize: "20px" }}>SmartWeather</b>
        <p>
          Saiba onde cuidar primeiro, antes que o mato e a chuva decidam por
          você.
        </p>
        <span className="sm" style={{ opacity: 0.7 }}>
          Áreas verdes urbanas · Clima em tempo real · Equipes em campo
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <span className="mu">Acesse com sua conta da prefeitura ou empresa.</span>
        <div className="seg">
          {ROLES.map((r) => {
            const pressed = role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                aria-pressed={pressed ? "true" : "false"}
                onClick={() => setRole(r.value)}
              >
                <b>{r.title}</b>
                <br />
                <span className="sm mu">{r.description}</span>
              </button>
            );
          })}
        </div>
        <label>
          E-mail
          <input
            type="email"
            defaultValue="marina.souza@prefeitura.gov.br"
            required
          />
        </label>
        <label>
          Senha
          <input type="password" defaultValue="senha1234" required />
        </label>
        <button className="btn w" type="submit">
          Entrar
        </button>
      </form>
    </section>
  );
}

export default LoginPage;