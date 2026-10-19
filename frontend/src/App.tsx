import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { routes } from "./routes/routes";

// páginas
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Lockers from "./pages/Lockers";
import Events from "./pages/Events";
import RequireAuth from "./auth/RequireAuth";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import LockerProfile from "./pages/LockerProfile";

export const router = createBrowserRouter([
  {
    path: routes.login.path,
    element: <Login />
  },
  {
    path: routes.forbidden.path,
    element: <Forbidden />
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: routes.dashboard.path, element: <Dashboard /> },
      { path: routes.users.path, element: <Users /> },
      { path: `${routes.users.path}/:id`, element: <UserProfile /> },
      { path: `${routes.lockers.path}/:id`, element: <LockerProfile /> },
      { path: routes.lockers.path, element: <Lockers /> },
      { path: routes.logs.path, element: <Events /> }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])