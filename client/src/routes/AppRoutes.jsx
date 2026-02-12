import { AnimatePresence, motion } from "framer-motion";
import { Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import useAuth from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddFood from "../pages/AddFood";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Landing from "../pages/Landing";
import { useEffect, useState } from "react";
import { BarChart3, LayoutDashboard, PlusCircle, User } from "lucide-react";

const mobileLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-food", label: "Add Food", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

function AuthRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="relative flex gap-4 p-4 sm:p-6">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className="min-w-0 flex-1 pb-20 md:pb-0">
          <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-4 sm:mx-6"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </div>
      <nav className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl border border-white/30 bg-white/80 p-2 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {mobileLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium ${
                  active ? "bg-brand-600 text-white" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <Icon className="mb-1 h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />

      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-food" element={<AddFood />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
