import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Leaf, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Button from "../components/common/Button";

const features = [
  {
    title: "Track Inventory",
    description: "Add food items, monitor expiry, and reduce spoilage in one place.",
    icon: Leaf,
  },
  {
    title: "Waste Analytics",
    description: "Visualize waste trends and category breakdown to make better decisions.",
    icon: BarChart3,
  },
  {
    title: "Secure Access",
    description: "Your data is protected with authenticated access and per-user isolation.",
    icon: ShieldCheck,
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const analyticsCtaPath = isAuthenticated ? "/analytics" : "/login";

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/25 bg-white/65 px-4 py-3 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Smart Food Waste Tracker</p>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Create Account</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="mb-10 grid items-center gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-3 inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              Clean kitchen analytics
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                Stop Guessing.
              </motion.div>
              <motion.span className="block text-brand-600 mt-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                Track Food Before It Expires.
              </motion.span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Smart Food Waste Tracker helps you monitor inventory, detect near-expiry items early, and reduce waste with simple visual insights.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg">{isAuthenticated ? "Open Dashboard" : "Get Started"}</Button>
              </Link>
              <Link to={analyticsCtaPath}>
                <Button variant="secondary" size="lg">
                  {isAuthenticated ? "View Analytics UI" : "Login to View Analytics"}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="glass-card overflow-hidden">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-500">Tracked Items</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">240+</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-500">Waste Reduced</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">37%</p>
                </div>
                <div className="rounded-2xl border border-white/30 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-500">Near Expiry Alerts</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">Real-time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="glass-card transition duration-200 hover:-translate-y-1">
              <Icon className="mb-3 h-7 w-7 text-brand-600" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
