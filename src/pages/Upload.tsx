// src/pages/Upload.tsx
import { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Select a file first!");
    // TODO: integrate with media.api.ts
    console.log("Uploading file:", file.name);
  };

 return (
  <div className="min-h-screen min-w-0 bg-gray-50 p-3 sm:p-5 lg:p-6">
    <div className="mx-auto w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-5 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
        Upload File
      </h1>

      <div className="space-y-4">
        <input
          type="file"
          onChange={handleChange}
          className="block w-full min-w-0 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />

        {file && (
          <div className="min-w-0 rounded-lg bg-blue-50 p-3">
            <p className="text-xs font-medium text-gray-500">
              Selected file
            </p>
            <p className="mt-1 wrap-break-word text-sm text-gray-800">
              {file.name}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto sm:py-2"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
);
};

export default Upload;
