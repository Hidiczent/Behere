import { Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/ChatChanel";
import MainLayout from "../layouts/MainLayout";
import Service from "../pages/Service";
import AuthPage from "../pages/Auth";
import AuthCallback from "../pages/OAuthCallback";
import ContentDetail from "../pages/ContentDetail";
import { Card } from "../components/content/Card";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/content" element={<Outlet />}>
          <Route index element={<Card />} /> {/* /content */}
          <Route path=":id" element={<ContentDetail />} /> {/* /content/:id */}
        </Route>

        {/* เท่ากับ /content/:id */}
        <Route path="/service" element={<Service />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
