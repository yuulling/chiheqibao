import { put } from "@vercel/blob";

export async function saveFile(file: File): Promise<string> {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file.name.includes(".") ? file.name.split(".").pop() || "jpg" : "jpg";
  const filename = `products/${timestamp}-${randomStr}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
