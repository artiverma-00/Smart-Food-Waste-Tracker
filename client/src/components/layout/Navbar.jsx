import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";

export default function Navbar({ darkMode, onToggleDarkMode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-40 mx-4 mb-4 rounded-2xl border border-white/25 bg-white/65 px-4 py-3 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/60 sm:mx-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Smart Food Waste Tracker</p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-300">{location.pathname.replace("/", "") || "dashboard"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/profile" className="hidden rounded-2xl border border-white/20 px-3 py-2 text-sm font-medium dark:border-slate-700 sm:block">
            {user?.name || "Profile"}
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
        </div>
      </div>
    </motion.header>
  );
}
