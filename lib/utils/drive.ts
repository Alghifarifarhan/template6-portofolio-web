/**
 * Converts shared Google Drive URLs (e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * into directly embeddable image URLs (https://lh3.googleusercontent.com/d/FILE_ID).
 */
export function parseDriveImageUrl(url: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  
  if (!trimmed.includes("drive.google.com")) {
    return trimmed;
  }

  // Regex to extract FILE_ID from various Google Drive URL patterns
  const fileIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}
