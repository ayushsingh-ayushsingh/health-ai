import { Route, Routes } from "react-router-dom";

import DashboardLayout from "@/components/pages/dashboard";
import Settings from "@/components/pages/settings";
import Login from "@/components/pages/login";
import Signup from "@/components/pages/signup";
import Home from "./components/pages/home";
import ChatBot from "./components/pages/chatbot";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="settings" element={<Settings />} />
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<ChatBot />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
