/**
 * File interface for upload attachments
 */
export interface File {
    uri: string;
    type?: string;
    name?: string;
}
/**
 * Parameters for upload attachments
 */
interface UploadAttachmentsParams {
    files: File[];
    apiUrl?: string;
}
/**
 * Hook for uploading attachments
 * @returns Mutation for uploading attachments
 */
export declare const useUploadAttachments: () => import("react-query").UseMutationResult<any, unknown, UploadAttachmentsParams, unknown>;
export {};
