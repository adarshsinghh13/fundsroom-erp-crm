import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Briefcase, ShieldCheck, Zap, BarChart3, UserPlus } from "lucide-react";
import api from "../../api/api";

const FEATURES = [
  { icon: BarChart3, title: "Real-time Analytics", desc: "Live revenue and inventory dashboards" },
  { icon: Zap,       title: "Lightning Fast",      desc: "Optimised for speed across all devices" },
  { icon: ShieldCheck, title: "Secure & Reliable",  desc: "JWT-auth with role-based access control" },
];

export function Register() {
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // 1. Register the user
      await api.post("/auth/register", { name, email, password });
      
      // 2. Automatically log them in
      const loginResponse = await api.post("/auth/login", { email, password });
      const { token, user } = loginResponse.data.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-ink-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/20 blur-[100px]" />
        <div className="blob blob-delay-2 absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/25 to-cyan-400/15 blur-[120px]" />
        <div className="blob blob-delay-4 absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/15 blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-accent-600 shadow-lg shadow-indigo-500/30">
            <Briefcase size={20} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent tracking-tight">
            FundsRoom ERP
          </span>
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Start managing your business<br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              today.
            </span>
          </h1>
          <p className="mt-5 text-lg text-ink-400 leading-relaxed max-w-md">
            Join thousands of businesses managing their inventory, customers, and invoicing in one platform.
          </p>

          {/* Feature cards */}
          <div className="mt-10 space-y-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/30 to-accent-600/20 text-indigo-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-ink-600">© 2025 FundsRoom. All rights reserved.</p>
      </div>

      {/* ── Right panel — Register form ── */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-accent-600">
              <Briefcase size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              FundsRoom ERP
            </span>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/8 p-8 backdrop-blur-2xl shadow-elevation-3">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white tracking-tight">Create an account</h2>
              <p className="mt-1.5 text-sm text-ink-400">Get started with your free workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-400 flex items-center gap-2">
                  <span className="shrink-0">⚠</span>
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink-300">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 text-sm text-white placeholder:text-ink-600 focus:border-accent-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-500/25 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink-300">Email address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 text-sm text-white placeholder:text-ink-600 focus:border-accent-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-500/25 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink-300">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-white/12 bg-white/6 px-4 py-2.5 pr-11 text-sm text-white placeholder:text-ink-600 focus:border-accent-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-500/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors"
                  >
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-accent-500 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Sign up
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-ink-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-accent-400 hover:text-accent-300 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
