import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/ChatChanel";
import Contact from "../pages/Contact";
import MainLayout from "../layouts/MainLayout";
import Service from "../pages/Service";
import AuthPage from "../pages/Auth";
import AuthCallback from "../pages/OAuthCallback";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
