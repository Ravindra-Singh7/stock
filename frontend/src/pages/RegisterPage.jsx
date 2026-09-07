import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackdrop from "../components/shared/AnimatedBackdrop";
import GlassCard from "../components/shared/GlassCard";
import { useAuth } from "../context/AuthContext";
import { fadeUp, staggerContainer } from "../utils/motion";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await register(form);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <AnimatedBackdrop />
      <motion.div className="relative z-10 w-full max-w-md" variants={staggerContainer} initial="hidden" animate="show">
      <GlassCard className="w-full p-8">
        <motion.div variants={fadeUp}>
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">StockIt India</p>
        <h1 className="mt-3 text-3xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-slate-400">Create your account for Indian market tracking and screening.</p>
        </motion.div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <motion.input
            variants={fadeUp}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Full name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand-400/60 focus:bg-white/10"
          />
          <motion.input
            variants={fadeUp}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand-400/60 focus:bg-white/10"
          />
          <motion.input
            variants={fadeUp}
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-brand-400/60 focus:bg-white/10"
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </motion.button>
        </form>
        <motion.p variants={fadeUp} className="mt-5 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-300">Login</Link>
        </motion.p>
      </GlassCard>
      </motion.div>
    </div>
  );
}
