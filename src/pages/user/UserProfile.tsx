// src/pages/user/UserProfile.tsx

import { useAuth } from "../../hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth(); // assuming AuthProvider exposes `user`

  if (!user) {
  return (
    <div className="flex min-h-40 min-w-0 items-center justify-center p-4 sm:p-6">
      <p className="text-sm text-gray-500">Loading profile…</p>
    </div>
  );
}

return (
  <div className="mx-auto w-full min-w-0 max-w-xl space-y-5 p-3 sm:space-y-6 sm:p-5 lg:p-6">
    {/* Profile Header */}
    <header>
      <h1 className="text-xl font-semibold sm:text-2xl">Profile</h1>
      <p className="mt-1 text-sm text-gray-500 sm:text-base">
        Manage your personal information.
      </p>
    </header>

    {/* Personal Information */}
    <section className="min-w-0 space-y-4 rounded-lg border bg-white p-3 sm:p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 sm:text-sm">
          Name
        </label>
        <input
          className="w-full min-w-0 rounded-md border px-3 py-2.5 text-base sm:py-2 sm:text-sm"
          defaultValue={user.full_name}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 sm:text-sm">
          Email
        </label>
        <input
          className="w-full min-w-0 rounded-md border bg-gray-50 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
          defaultValue={user.email}
          disabled
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm text-white transition hover:bg-blue-700 sm:w-auto sm:py-2"
        >
          Save changes
        </button>
      </div>
    </section>

    {/* Change Password */}
    <section className="min-w-0 space-y-4 rounded-lg border bg-white p-3 sm:p-5">
      <h2 className="text-base font-medium text-gray-700 sm:text-lg">
        Change password
      </h2>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 sm:text-sm">
          Current password
        </label>
        <input
          type="password"
          className="w-full min-w-0 rounded-md border px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 sm:text-sm">
          New password
        </label>
        <input
          type="password"
          className="w-full min-w-0 rounded-md border px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm transition hover:bg-gray-50 sm:w-auto sm:py-2"
        >
          Update password
        </button>
      </div>
    </section>
  </div>
);

  // if (!user) {
  //   return (
  //     <div className="p-6">
  //       <p className="text-sm text-gray-500">Loading profile…</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="p-6 max-w-xl space-y-6">
  //     <header>
  //       <h1 className="text-2xl font-semibold">Profile</h1>
  //       <p className="text-sm text-gray-500 mt-1">
  //         Manage your personal information.
  //       </p>
  //     </header>

  //     <section className="rounded-lg border bg-white p-4 space-y-4">
  //       <div>
  //         <label className="block text-xs font-medium text-gray-500 mb-1">
  //           Name
  //         </label>
  //         <input
  //           className="w-full rounded-md border px-2 py-1.5 text-sm"
  //           defaultValue={user.full_name}
  //         />
  //       </div>

  //       <div>
  //         <label className="block text-xs font-medium text-gray-500 mb-1">
  //           Email
  //         </label>
  //         <input
  //           className="w-full rounded-md border px-2 py-1.5 text-sm bg-gray-50"
  //           defaultValue={user.email}
  //           disabled
  //         />
  //       </div>

  //       <div className="flex justify-end">
  //         <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
  //           Save changes
  //         </button>
  //       </div>
  //     </section>

  //     <section className="rounded-lg border bg-white p-4 space-y-4">
  //       <h2 className="text-sm font-medium text-gray-700">
  //         Change password
  //       </h2>
  //       <div>
  //         <label className="block text-xs font-medium text-gray-500 mb-1">
  //           Current password
  //         </label>
  //         <input
  //           type="password"
  //           className="w-full rounded-md border px-2 py-1.5 text-sm"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-xs font-medium text-gray-500 mb-1">
  //           New password
  //         </label>
  //         <input
  //           type="password"
  //           className="w-full rounded-md border px-2 py-1.5 text-sm"
  //         />
  //       </div>
  //       <div className="flex justify-end">
  //         <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
  //           Update password
  //         </button>
  //       </div>
  //     </section>
  //   </div>
  // );
}
