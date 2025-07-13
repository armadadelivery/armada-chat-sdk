import RNFS from 'react-native-fs';

/**
 * Downloads a file from a URL to the local file system
 * @param url The URL to download the file from
 * @returns The local file path if successful, null otherwise
 */
export default async function downloadFile(
  url: string,
): Promise<string | null> {
  // Generate a random filename with the pattern "0.RANDOM_NUMBER.mp3"
  const randomNumber = Math.random();
  const extension = url.split('.').pop()?.toLowerCase() || 'mp3';
  const fileName = `${randomNumber}.${extension}`;

  // Use the cache directory instead of the document directory
  const localFilePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  try {
    const response = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localFilePath,
    }).promise;

    if (response.statusCode === 200) {
      // eslint-disable-next-line no-console
      console.log('File downloaded successfully:', localFilePath);
      return localFilePath;
    } else {
      // eslint-disable-next-line no-console
      console.error('Failed to download file:', response.statusCode);
      return null;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error downloading file:', error);
    return null;
  }
}
