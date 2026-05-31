// src/pages/user/UserProfile.tsx

import { useAuth } from "../../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth(); // assuming AuthProvider exposes `user`

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information.
        </p>
      </header>

      <section className="rounded-lg border bg-white p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Name
          </label>
          <input
            className="w-full rounded-md border px-2 py-1.5 text-sm"
            defaultValue={user.full_name}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email
          </label>
          <input
            className="w-full rounded-md border px-2 py-1.5 text-sm bg-gray-50"
            defaultValue={user.email}
            disabled
          />
        </div>

        <div className="flex justify-end">
          <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Save changes
          </button>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-4">
        <h2 className="text-sm font-medium text-gray-700">
          Change password
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Current password
          </label>
          <input
            type="password"
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            New password
          </label>
          <input
            type="password"
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
            Update password
          </button>
        </div>
      </section>
    </div>
  );
}
