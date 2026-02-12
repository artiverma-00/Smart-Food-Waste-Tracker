import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await login(form);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Unable to login";
      setError(message);
      if (message.toLowerCase().includes("too many attempts")) {
        setCooldownSeconds(60);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 bg-mesh px-4 dark:bg-slate-950">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/30 bg-white/75 p-6 shadow-glass backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70"
      >
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">Sign in to monitor your inventory and waste insights.</p>
        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          minLength={6}
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {cooldownSeconds > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-300">
            Please wait {cooldownSeconds}s before trying again.
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading || cooldownSeconds > 0}>
          {loading ? "Signing in..." : cooldownSeconds > 0 ? `Try again in ${cooldownSeconds}s` : "Sign In"}
        </Button>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          New here? <Link className="font-semibold text-brand-700 dark:text-brand-300" to="/register">Create an account</Link>
        </p>
      </motion.form>
    </div>
  );
}
