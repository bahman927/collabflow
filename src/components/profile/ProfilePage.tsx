
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserCircle, Camera } from "lucide-react";

export function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(
    user?.full_name || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const [photo, setPhoto] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  /*
   * Keep the form synchronized if the user object
   * changes after login/update.
   */
  useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
  }, [user]);

  /*
   * Use the avatar returned by the backend.
   *
   * Fallback to the old email-based image if no avatar
   * is available.
   */
  // const profileImage =
  //   user?.avatar ||
    // (user?.email
    //   ? `/${user.email.split("@")[0]}.JPG`
    //   : "");
    
    const profileImage = user?.avatar || "";

  const handleEdit = () => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setPhoto(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setPhoto(null);
    setIsEditing(false);
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setPhoto(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateUser({
        full_name: fullName,
        email,
        avatar: photo,
      });

      setPhoto(null);
      setIsEditing(false);

    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-6 sm:py-8">

    {/* Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Profile
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Manage your personal information
      </p>
    </div>

    {/* Profile Card */}
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

      {/* Profile Header */}
      <div className="mb-6 flex min-w-0 items-center gap-4 sm:mb-8 sm:gap-5">

        <div className="relative shrink-0">

          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <UserCircle
              size={64}
              className="text-gray-400 sm:hidden"
            />
          )}

          {!profileImage && (
            <UserCircle
              size={80}
              className="hidden text-gray-400 sm:block"
            />
          )}

          {isEditing && (
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
            >
              <Camera size={16} />

              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}

        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 wrap-break-word">
            {user?.full_name || "User"}
          </h2>

          <p className="text-sm text-gray-500 wrap-break-word">
            {user?.email}
          </p>
        </div>

      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <>
          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm wrap-break-word sm:py-2">
                {user?.full_name || "Not provided"}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm wrap-break-word sm:py-2">
                {user?.email || "Not provided"}
              </div>
            </div>

          </div>

          {/* EDIT BUTTON */}
          <div className="mt-6 sm:mt-8">
            <button
              type="button"
              onClick={handleEdit}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto sm:py-2"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="space-y-5">

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-2 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-2 sm:text-sm"
            />
          </div>

          {/* Photo */}
          <div>
            <label
              htmlFor="profilePhoto"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Profile Photo
            </label>

            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full min-w-0 text-sm text-gray-600"
            />

            {photo && (
              <p className="mt-1 text-xs text-gray-500 wrap-break-word">
                Selected: {photo.name}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:gap-3">

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:py-2"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:w-auto sm:py-2"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  </div>
);

  // return (
  //   <div className="max-w-4xl mx-auto px-6 py-8">

  //     {/* Header */}
  //     <div className="mb-8">
  //       <h1 className="text-2xl font-bold text-gray-900">
  //         Profile
  //       </h1>

  //       <p className="text-sm text-gray-500 mt-1">
  //         Manage your personal information
  //       </p>
  //     </div>

  //     {/* Profile Card */}
  //     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

  //       {/* Profile Header */}
  //       <div className="flex items-center gap-5 mb-8">

  //         <div className="relative">

  //           {profileImage ? (
  //             <img
  //               src={profileImage}
  //               alt="Profile"
  //               className="w-20 h-20 rounded-full object-cover"
  //             />
  //           ) : (
  //             <UserCircle
  //               size={80}
  //               className="text-gray-400"
  //             />
  //           )}

  //           {isEditing && (
  //             <label
  //               htmlFor="profilePhoto"
  //               className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
  //             >
  //               <Camera size={16} />

  //               <input
  //                 id="profilePhoto"
  //                 type="file"
  //                 accept="image/*"
  //                 onChange={handlePhotoChange}
  //                 className="hidden"
  //               />
  //             </label>
  //           )}

  //         </div>

  //         <div>
  //           <h2 className="text-lg font-semibold text-gray-900">
  //             {user?.full_name || "User"}
  //           </h2>

  //           <p className="text-sm text-gray-500">
  //             {user?.email}
  //           </p>
  //         </div>

  //       </div>

  //       {/* VIEW MODE */}
  //       {!isEditing && (
  //         <>
  //           <div className="space-y-5">

  //             {/* Full Name */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Full Name
  //               </label>

  //               <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
  //                 {user?.full_name || "Not provided"}
  //               </div>
  //             </div>

  //             {/* Email */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-1">
  //                 Email
  //               </label>

  //               <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
  //                 {user?.email || "Not provided"}
  //               </div>
  //             </div>

  //           </div>

  //           {/* EDIT BUTTON */}
  //           <div className="mt-8">
  //             <button
  //               type="button"
  //               onClick={handleEdit}
  //               className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
  //             >
  //               Edit Profile
  //             </button>
  //           </div>
  //         </>
  //       )}

  //       {/* EDIT MODE */}
  //       {isEditing && (
  //         <div className="space-y-5">

  //           {/* Full Name */}
  //           <div>
  //             <label
  //               htmlFor="fullName"
  //               className="block text-sm font-medium text-gray-700 mb-1"
  //             >
  //               Full Name
  //             </label>

  //             <input
  //               id="fullName"
  //               type="text"
  //               value={fullName}
  //               onChange={(e) => setFullName(e.target.value)}
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  //             />
  //           </div>

  //           {/* Email */}
  //           <div>
  //             <label
  //               htmlFor="email"
  //               className="block text-sm font-medium text-gray-700 mb-1"
  //             >
  //               Email
  //             </label>

  //             <input
  //               id="email"
  //               type="email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  //             />
  //           </div>

  //           {/* Photo */}
  //           <div>
  //             <label
  //               htmlFor="profilePhoto"
  //               className="block text-sm font-medium text-gray-700 mb-1"
  //             >
  //               Profile Photo
  //             </label>

  //             <input
  //               id="profilePhoto"
  //               type="file"
  //               accept="image/*"
  //               onChange={handlePhotoChange}
  //               className="w-full text-sm text-gray-600"
  //             />

  //             {photo && (
  //               <p className="text-xs text-gray-500 mt-1">
  //                 Selected: {photo.name}
  //               </p>
  //             )}
  //           </div>

  //           {/* BUTTONS */}
  //           <div className="flex gap-3 pt-4">

  //             <button
  //               type="button"
  //               onClick={handleSave}
  //               disabled={saving}
  //               className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
  //             >
  //               {saving ? "Saving..." : "Save Changes"}
  //             </button>

  //             <button
  //               type="button"
  //               onClick={handleCancel}
  //               disabled={saving}
  //               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
  //             >
  //               Cancel
  //             </button>

  //           </div>

  //         </div>
  //       )}

  //     </div>
  //   </div>
  // );
}
 




// import { useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { UserCircle } from "lucide-react";

// export function ProfilePage() {
//   const { user, updateUser } = useAuth();

//   const [isEditing, setIsEditing] = useState(false);

//   const [fullName, setFullName] = useState(
//     user?.full_name || ""
//   );

//   const profileImage = user?.email
//     ? `/${user.email.split("@")[0]}.JPG`
//     : "";

//   const handleEdit = () => {
//     setFullName(user?.full_name || "");
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setFullName(user?.full_name || "");
//     setIsEditing(false);
//   };

// const [saving, setSaving] = useState(false);

// const handleSave = async () => {
//   try {
//     setSaving(true);

//     await updateUser({
//       full_name: fullName,
//     });

//     setIsEditing(false);
//   } catch (error) {
//     console.error("Failed to update profile:", error);
//   } finally {
//     setSaving(false);
//   }
// };

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-8">

//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Profile
//         </h1>

//         <p className="text-sm text-gray-500 mt-1">
//           Manage your personal information
//         </p>
//       </div>


//       {/* Profile Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

//         {/* Profile Header */}
//         <div className="flex items-center gap-5 mb-8">

//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-20 h-20 rounded-full object-cover"
//             />
//           ) : (
//             <UserCircle
//               size={80}
//               className="text-gray-400"
//             />
//           )}

//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               {user?.full_name || "User"}
//             </h2>

//             <p className="text-sm text-gray-500">
//               {user?.email}
//             </p>
//           </div>

//         </div>


//         {/* VIEW MODE */}
//         {!isEditing && (
//           <>
//             <div className="space-y-5">

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>

//                 <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
//                   {user?.full_name || "Not provided"}
//                 </div>
//               </div>


//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>

//                 <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
//                   {user?.email || "Not provided"}
//                 </div>
//               </div>

//             </div>


//             {/* EDIT BUTTON */}
//             <div className="mt-8">
//               <button
//                 type="button"
//                 onClick={handleEdit}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </>
//         )}


//         {/* EDIT MODE */}
//         {isEditing && (
//           <div className="space-y-5">

//             {/* Full Name */}
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Full Name
//               </label>

//               <input
//                 id="fullName"
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
//               />
//             </div>


//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>

//               <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
//                 {user?.email}
//               </div>

//               <p className="text-xs text-gray-400 mt-1">
//                 Email cannot be changed here.
//               </p>
//             </div>


//             {/* BUTTONS */}
//             <div className="flex gap-3 pt-4">

//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>

//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }