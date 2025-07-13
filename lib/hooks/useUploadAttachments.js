"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUploadAttachments = void 0;
const react_native_encrypted_storage_1 = __importDefault(require("react-native-encrypted-storage"));
const react_query_1 = require("react-query");
// Import TOKEN constant from the main app
const TOKEN = '@token';
/**
 * Get MIME type based on file extension
 * @param uri File URI
 * @returns MIME type string
 */
const getMimeType = (uri) => {
    var _a;
    // Extract file extension
    const extension = (_a = uri.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // Map common extensions to MIME types
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'mp3':
            return 'audio/mpeg';
        case 'm4a':
            return 'audio/m4a';
        case 'aac':
            return 'audio/aac';
        case 'wav':
            return 'audio/wav';
        case 'ogg':
            return 'audio/ogg';
        default:
            // Default to binary if we can't determine the type
            return 'application/octet-stream';
    }
};
/**
 * Normalize file URI for cross-platform compatibility
 * @param uri Original file URI
 * @returns Normalized URI
 */
const normalizeUri = (uri) => {
    // Handle file:// protocol
    if (uri.startsWith('file://')) {
        return uri;
    }
    // If it's a local path without protocol, add file:// prefix
    if (uri.startsWith('/')) {
        return `file://${uri}`;
    }
    return uri;
};
/**
 * Upload attachments function
 * @param param0 Upload parameters
 * @returns Promise with the response
 */
const uploadAttachments = async ({ files, apiUrl = 'https://api.armadadelivery.com/armadaNow/v0/file/upload', }) => {
    try {
        // Get the token from EncryptedStorage
        const token = await react_native_encrypted_storage_1.default.getItem(TOKEN);
        const formData = new FormData();
        files.forEach(file => {
            // Normalize the URI
            const normalizedUri = normalizeUri(file.uri);
            // Get file name from URI or use provided name
            const fileName = file.name || normalizedUri.split('/').pop() || `file-${Date.now()}`;
            // Determine file type
            const fileType = file.type || getMimeType(normalizedUri);
            // Log file details in development
            if (__DEV__) {
                // eslint-disable-next-line no-console
                console.log('Uploading file:', {
                    uri: normalizedUri,
                    type: fileType,
                    name: fileName,
                });
            }
            formData.append('file', {
                uri: normalizedUri,
                type: fileType,
                name: fileName,
            });
        });
        // Use fetch API for broader compatibility
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data',
                token: token || '',
            },
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload attachment: ${response.status} ${errorText}`);
        }
        return await response.json();
    }
    catch (error) {
        // Log detailed error in development
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('Upload attachment error:', error);
        }
        throw error;
    }
};
/**
 * Hook for uploading attachments
 * @returns Mutation for uploading attachments
 */
const useUploadAttachments = () => {
    return (0, react_query_1.useMutation)(uploadAttachments);
};
exports.useUploadAttachments = useUploadAttachments;
