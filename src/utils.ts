/**
 * Converts a Google Drive share link to a direct image link.
 * @param url The Google Drive URL
 * @returns The direct image URL or the original URL if not a Drive link
 */
export const getDirectImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Handle Google Drive links
  if (url.includes('drive.google.com')) {
    let fileId = '';
    
    // Extract ID from various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([^/]+)/,
      /[?&]id=([^&]+)/,
      /\/d\/([^/]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }
    
    if (fileId) {
      // The thumbnail endpoint is very reliable for embedding and bypasses virus scan warnings
      // sz=w1600 requests a high-quality version
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }
  
  return url;
};
