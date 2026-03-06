/**
 * Converts a Google Drive share link to a direct image link.
 * @param url The Google Drive URL
 * @returns The direct image URL or the original URL if not a Drive link
 */
export const getDirectImageUrl = (url: string): string => {
  if (!url) return "";

  // Handle Google Drive links
  if (url.includes("drive.google.com")) {
    let fileId = "";

    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    if (url.includes("/file/d/")) {
      fileId = url.split("/file/d/")[1].split("/")[0];
    }
    // Format: https://drive.google.com/open?id=FILE_ID
    else if (url.includes("?id=")) {
      fileId = url.split("?id=")[1].split("&")[0];
    }

    if (fileId) {
      // Use the direct link format that works best for embedding
      // Appending =s0 ensures the original resolution is served
      return `https://lh3.googleusercontent.com/u/0/d/${fileId}=s0`;
    }
  }

  return url;
};
