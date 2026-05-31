// src/pages/settings/Settings.tsx

import { useAuth } from "../../hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your account and workspace preferences.
        </p>
      </header>

      <section className="rounded-lg border bg-white p-4 space-y-4">
        <h2 className="text-sm font-medium text-gray-700">
          Account
        </h2>
        <p className="text-xs text-gray-500">
          Signed in as <span className="font-medium">{user?.email}</span>
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Receive email updates</span>
          <button className="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-gray-50">
            Toggle
          </button>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-4">
        <h2 className="text-sm font-medium text-gray-700">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Theme</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50">
              Light
            </button>
            <button className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50">
              Dark
            </button>
            <button className="px-3 py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50">
              System
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-4">
        <h2 className="text-sm font-medium text-red-600">
          Danger zone
        </h2>
        <p className="text-xs text-gray-500">
          Workspace deletion is permanent. This is just a placeholder for now.
        </p>
        <button className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50">
          Delete workspace
        </button>
      </section>
    </div>
  );
}
