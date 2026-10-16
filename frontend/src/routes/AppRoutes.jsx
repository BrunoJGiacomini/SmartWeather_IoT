import { Navigate, createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/RootLayout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ClimaPage from "../pages/ClimaPage.jsx";
import MapaPage from "../pages/MapaPage.jsx";
import OsPage from "../pages/OsPage.jsx";
import EquipamentosPage from "../pages/EquipamentosPage.jsx";
import AlertasPage from "../pages/AlertasPage.jsx";
import AppCampoPage from "../pages/AppCampoPage.jsx";
import PerfilPage from "../pages/PerfilPage.jsx";
import AppShell from "../components/AppShell.jsx";
import RequireAuth from "../components/RequireAuth.jsx";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        element: (
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        ),
        children: [
          { path: "/clima", element: <ClimaPage /> },
          { path: "/mapa", element: <MapaPage /> },
          { path: "/os", element: <OsPage /> },
          { path: "/equipamentos", element: <EquipamentosPage /> },
          { path: "/alertas", element: <AlertasPage /> },
          { path: "/app-campo", element: <AppCampoPage /> },
          { path: "/perfil", element: <PerfilPage /> },
          { path: "*", element: <Navigate to="/clima" replace /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
