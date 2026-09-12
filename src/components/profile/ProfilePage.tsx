import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserCircle } from "lucide-react";

export function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(
    user?.full_name || ""
  );

  const profileImage = user?.email
    ? `/${user.email.split("@")[0]}.JPG`
    : "";

  const handleEdit = () => {
    setFullName(user?.full_name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFullName(user?.full_name || "");
    setIsEditing(false);
  };

const [saving, setSaving] = useState(false);

const handleSave = async () => {
  try {
    setSaving(true);

    await updateUser({
      full_name: fullName,
    });

    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>


      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8">

          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              size={80}
              className="text-gray-400"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.full_name || "User"}
            </h2>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

        </div>


        {/* VIEW MODE */}
        {!isEditing && (
          <>
            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {user?.full_name || "Not provided"}
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {user?.email || "Not provided"}
                </div>
              </div>

            </div>


            {/* EDIT BUTTON */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>


            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                {user?.email}
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed here.
              </p>
            </div>


            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}