import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const avatarsDir = path.resolve(process.cwd(), "uploads", "avatars");

async function ensureAvatarsDir(): Promise<void> {
  await fs.mkdir(avatarsDir, { recursive: true });
}

function resolveStoredFilePath(storedPath: string): string {
  return path.resolve(process.cwd(), storedPath.replace(/^\//, ""));
}

export async function saveAvatarImage(
  file: Express.Multer.File,
): Promise<string> {
  await ensureAvatarsDir();

  const isPng = file.mimetype === "image/png";
  const filename = `${randomUUID()}.${isPng ? "png" : "jpg"}`;
  const targetPath = path.join(avatarsDir, filename);
  const image = sharp(file.buffer).resize(256, 256, {
    fit: "cover",
    position: "centre",
  });

  if (isPng) {
    await image.png({ compressionLevel: 9 }).toFile(targetPath);
  } else {
    await image.jpeg({ quality: 85, mozjpeg: true }).toFile(targetPath);
  }

  return `/uploads/avatars/${filename}`;
}

export async function removeAvatarFile(avatarUrl: string): Promise<void> {
  try {
    await fs.unlink(resolveStoredFilePath(avatarUrl));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
