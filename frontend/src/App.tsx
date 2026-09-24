import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { routes } from "./routes/routes";

// páginas
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/old/LoginForm";
import Users from "./pages/Users";
import Lockers from "./pages/Lockers";
import Logs from "./pages/Logs";

export const router = createBrowserRouter([
  {
    path: routes.login.path,
    element: <LoginForm />
  },
  {
    path: routes.forbidden.path,
    // element:<Forbidden/>
  },
  {
    path: "/",
    element: (
      // <RequireAuth>
      <RootLayout />
      // </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: routes.dashboard.path, element: <Dashboard /> },
      { path: routes.users.path, element: <Users /> },
      { path: routes.lockers.path, element: <Lockers /> },
      { path: routes.logs.path, element: <Logs /> }
    ]
  }
])