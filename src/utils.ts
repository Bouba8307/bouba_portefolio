/**
 * Converts a Google Drive share link to a direct image link.
 * @param url The Google Drive URL
 * @returns The direct image URL or the original URL if not a Drive link
 */
export const getDirectImageUrl = (url: string | undefined): string => {
  if (!url) return "";

  // Handle Google Drive links
  if (url.includes("drive.google.com")) {
    let fileId = "";

    // Extract ID from various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([^/]+)/,
      /[?&]id=([^&]+)/,
      /\/d\/([^/]+)/,
      /\/open\?id=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (fileId) {
      // Use the lh3 endpoint for images as it's more reliable and bypasses virus scan warnings
      // For non-images, uc?export=view is still the standard
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return url;
};

/**
 * Converts a Google Drive share link to a direct download link.
 * @param url The Google Drive URL
 * @returns The direct download URL or the original URL if not a Drive link
 */
export const getDirectDownloadUrl = (url: string | undefined): string => {
  if (!url) return "";

  if (url.includes("drive.google.com")) {
    let fileId = "";
    const patterns = [
      /\/file\/d\/([^/]+)/,
      /[?&]id=([^&]+)/,
      /\/d\/([^/]+)/,
      /\/open\?id=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  return url;
};
