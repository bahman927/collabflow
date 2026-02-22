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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      <input
        type="file"
        onChange={handleChange}
        className="border p-2 mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>
      {file && <p className="mt-2">Selected: {file.name}</p>}
    </div>
  );
};

export default Upload;
