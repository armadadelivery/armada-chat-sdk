"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fs_1 = __importDefault(require("react-native-fs"));
/**
 * Downloads a file from a URL to the local file system
 * @param url The URL to download the file from
 * @returns The local file path if successful, null otherwise
 */
async function downloadFile(url) {
    var _a;
    // Generate a random filename with the pattern "0.RANDOM_NUMBER.mp3"
    const randomNumber = Math.random();
    const extension = ((_a = url.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'mp3';
    const fileName = `${randomNumber}.${extension}`;
    // Use the cache directory instead of the document directory
    const localFilePath = `${react_native_fs_1.default.CachesDirectoryPath}/${fileName}`;
    try {
        const response = await react_native_fs_1.default.downloadFile({
            fromUrl: url,
            toFile: localFilePath,
        }).promise;
        if (response.statusCode === 200) {
            // eslint-disable-next-line no-console
            console.log('File downloaded successfully:', localFilePath);
            return localFilePath;
        }
        else {
            // eslint-disable-next-line no-console
            console.error('Failed to download file:', response.statusCode);
            return null;
        }
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error downloading file:', error);
        return null;
    }
}
exports.default = downloadFile;
