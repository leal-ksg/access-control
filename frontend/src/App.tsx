import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import CabinetList from "./pages/CabinetList";
import ActivityHistory from "./pages/ActivityHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/lista-armarios" element={<CabinetList />} />
        <Route path="/historico-atividades" element={<ActivityHistory />} />
      </Routes>
    </BrowserRouter>
  );
}