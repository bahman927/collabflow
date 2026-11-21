// src/pages/auth/Signup.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Camera,
  X,
} from "lucide-react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password2.length === 0 || password === password2;

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    // Allow the user to cancel the file picker without changing the current photo.
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_PHOTO_SIZE) {
      setError("The photo must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setError(null);
    setPhoto(selectedFile);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup({
        email,
        password,
        full_name: fullName,
        avatar: photo ?? undefined,
      });
      await login({ email, password });
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex min-h-screen min-w-0 items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-3 py-8 sm:px-5 sm:py-10">
    {/* Decorative blobs */}
    <div className="pointer-events-none fixed -right-16 -top-16 h-48 w-48 rounded-full bg-purple-200 opacity-30 blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72" />
    <div className="pointer-events-none fixed -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-200 opacity-30 blur-3xl sm:-bottom-24 sm:-left-24 sm:h-72 sm:w-72" />

    <div className="relative z-10 w-full min-w-0 max-w-md">
      {/* Logo / Brand */}
      <div className="mb-6 text-center sm:mb-8">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg sm:mb-4 sm:h-14 sm:w-14">
          <UserPlus size={26} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Create account
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Get started — it's free
        </p>
      </div>

      {/* Card */}
      <div className="min-w-0 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-xl backdrop-blur-sm sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex min-w-0 items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4"
            >
              <span className="shrink-0">⚠</span>
              <span className="min-w-0 wrap-break-word">{error}</span>
            </div>
          )}

          {/* Optional profile photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile photo{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-gray-400 sm:h-20 sm:w-20">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Selected profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={30} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <label className="inline-flex min-h-10 max-w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  <Camera size={16} className="shrink-0" />
                  <span className="wrap-break-word">
                    {photo ? "Change photo" : "Choose photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    aria-label="Choose optional profile photo"
                  />
                </label>

                <p className="mt-1.5 text-xs text-gray-500">
                  Image files up to 5 MB.
                </p>

                {photo && (
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                    <span className="max-w-full truncate text-xs text-gray-600">
                      {photo.name}
                    </span>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex shrink-0 items-center gap-1 py-1 text-xs font-medium text-red-600 transition hover:text-red-700"
                      aria-label="Remove selected profile photo"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full min-w-0 rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

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
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full min-w-0 rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full min-w-0 rounded-lg border py-3 pl-10 pr-4 text-base outline-none transition focus:ring-2 sm:py-2.5 sm:text-sm ${
                  !passwordsMatch
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
            </div>

            {!passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-sm text-gray-500 sm:mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  </div>
);
};

export default SignupPage;
