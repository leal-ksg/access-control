import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes/routes";

import RootLayout from "./layouts/RootLayout";
import RequireAuth from "./auth/RequireAuth";

// páginas
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/User/UserList";
import LockerList from "./pages/Locker/LockerList";
import Events from "./pages/Events";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserProfile from "./pages/User/UserProfile";
import LockerProfile from "./pages/Locker/LockerProfile";
import UserEdit from "./pages/User/UserEdit";
import UserCreate from "./pages/User/UserCreate";
import LockerEdit from "./pages/Locker/LockerEdit";
import LockerCreate from "./pages/Locker/LockerCreate";

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
      { path: routes.logs.path, element: <Events /> },

      // users
      { path: routes.users.path, element: <UserList /> },
      { path: `${routes.users.path}/:id`, element: <UserProfile /> },
      { path: `${routes.users.editPath}/:id`, element: <UserEdit /> },
      { path: routes.users.createPath, element: <UserCreate /> },

      // lockers
      { path: routes.lockers.path, element: <LockerList /> },
      { path: `${routes.lockers.path}/:id`, element: <LockerProfile /> },
      { path: `${routes.lockers.editPath}/:id`, element: <LockerEdit /> },
      { path: routes.lockers.createPath, element: <LockerCreate /> }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])