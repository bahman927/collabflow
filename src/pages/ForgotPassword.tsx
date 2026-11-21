// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

type ForgotPasswordProps = {
  onBackToLogin?: () => void;
};

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // 🔥 Replace with your Django endpoint later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="mx-auto w-full min-w-0 max-w-md px-1 sm:px-2">
    {!success ? (
      <>
        {/* Reset Password Form */}
        <h2 className="mb-2 wrap-break-word text-xl font-semibold text-gray-800 sm:text-2xl">
          Reset your password
        </h2>

        <p className="mb-5 text-sm leading-relaxed text-gray-600 sm:mb-6">
          Enter your email and we'll send you instructions to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-w-0 rounded-lg border px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />

          {error && (
            <p className="wrap-break-word rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm leading-relaxed text-gray-600">
            Remember your password?{" "}
            {onBackToLogin ? (
              <button
                type="button"
                onClick={onBackToLogin}
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Back to Login
              </button>
            ) : (
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Login
              </Link>
            )}
          </p>
        </form>
      </>
    ) : (
      /* Success Message */
      <div className="space-y-4 text-center">
        <h2 className="wrap-break-word text-xl font-semibold text-gray-800 sm:text-2xl">
          Check your email
        </h2>

        <p className="wrap-break-word text-sm leading-relaxed text-gray-600">
          If an account exists for <strong>{email}</strong>, you’ll receive a
          password reset link shortly.
        </p>

        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-block rounded px-3 py-2 font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
        >
          Back to Login
        </button>
      </div>
    )}
  </div>
);
}