import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const { uid, token } = useParams<{
    uid: string;
    token: string;
  }>();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!uid || !token) {
      setError("Invalid or incomplete password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/password-reset/confirm/`,
        {
          uid,
          token,
          new_password:password,
        }
      );

      setMessage(
        response.data.message ||
          "Password has been reset successfully."
      );

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        if (data?.error) {
          setError(data.error);
        } else if (data?.detail) {
          setError(data.detail);
        } else if (data?.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError(
            "The password reset link is invalid or has expired."
          );
        }
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
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
          Enter your new password below.
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
        {/* New password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            New password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
          />
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm new password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* Back to login */}
      <div className="mt-5 text-center sm:mt-6">
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

export default ResetPasswordPage;