import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${timestamp}-${randomStr}${ext}`;

  // Ensure upload directory exists
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Write file
  const filePath = path.join(UPLOAD_DIR, filename);
  await writeFile(filePath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
