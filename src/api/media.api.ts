// src/api/media.api.ts
import { API_BASE_URL } from "../app/config";

export const uploadMediaApi = async (
  file: File,
  token: string
): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/media/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }
};
