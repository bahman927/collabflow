
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/password-reset/`,
        { email }
      );

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Unable to send password reset email."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="flex min-h-screen min-w-0 items-center justify-center bg-gray-100 px-3 py-6 sm:px-5 sm:py-8">
    <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 sm:text-3xl">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-5 wrap-break-word rounded-lg bg-green-50 p-3 text-sm text-green-700 sm:mb-6 sm:p-4">
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-5 wrap-break-word rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:mb-6 sm:p-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Back to login */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-block rounded px-2 py-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  </div>
);
};

export default ForgetPasswordPage;

