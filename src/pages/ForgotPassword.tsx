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
    <div className="w-full max-w-md mx-auto">
      {!success ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Reset your password
          </h2>

          <p className="text-gray-600 text-sm mb-6">
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              {onBackToLogin ? (
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-indigo-600 font-medium"
                >
                  Back to Login
                </button>
              ) : (
                <Link to="/login" className="text-indigo-600 font-medium">
                  Login
                </Link>
              )}
            </p>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Check your email
          </h2>
          <p className="text-gray-600 text-sm">
            If an account exists for <strong>{email}</strong>, you’ll receive a
            password reset link shortly.
          </p>

          <button
            onClick={onBackToLogin}
            className="text-indigo-600 font-medium"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}