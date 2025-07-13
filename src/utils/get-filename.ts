/**
 * Extracts a filename from a URL or generates a unique one if not available
 * @param url The URL to extract the filename from
 * @returns The extracted or generated filename
 */
export default function getFilename(url: string): string {
  // Try to extract filename from URL
  const extractedName = url.split('/').pop();

  // If extraction failed or resulted in an empty string, generate a unique name
  if (!extractedName) {
    return `file_${new Date().getTime()}.mp3`;
  }

  // Remove query parameters if present
  const nameWithoutParams = extractedName.split('?')[0];

  // If name is still empty after removing params, generate a unique name
  if (!nameWithoutParams) {
    return `file_${new Date().getTime()}.mp3`;
  }

  return nameWithoutParams;
}
