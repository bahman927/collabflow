// src/pages/auth/Login.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, setTokens } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({ email, password });

      setTokens(data.tokens);

      // Return to the original destination (e.g. invitation page)
      const returnTo = location.state?.returnTo;

      if (returnTo) {
        navigate(returnTo, {
          replace: true,
          state: {
            invitationTokens: data.tokens,
          },
        });
      } else {
        navigate("/");
      }

    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex min-h-screen min-w-0 items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-3 py-8 sm:px-5 sm:py-10">
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-indigo-200 opacity-30 blur-3xl sm:h-72 sm:w-72" />
    <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-200 opacity-30 blur-3xl sm:h-72 sm:w-72" />

    <div className="relative z-10 w-full min-w-0 max-w-md">
      {/* Logo / Brand */}
      <div className="mb-6 text-center sm:mb-8">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg sm:mb-4 sm:h-14 sm:w-14">
          <LogIn size={26} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Sign in to your account
        </p>
      </div>

      {/* Card */}
      <div className="min-w-0 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-xl backdrop-blur-sm sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {error && (
            <div className="flex min-w-0 items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4">
              <span className="shrink-0">⚠</span>
              <span className="min-w-0 wrap-break-word">{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full min-w-0 rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="shrink-0 text-xs font-medium text-indigo-600 transition hover:text-indigo-500 sm:text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full min-w-0 rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-sm text-gray-500 sm:mt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          Create one
        </Link>
      </p>
    </div>
  </div>
);
};

export default LoginPage;



 