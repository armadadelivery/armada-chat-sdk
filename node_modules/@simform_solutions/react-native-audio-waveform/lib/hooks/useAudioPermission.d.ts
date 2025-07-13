export declare const useAudioPermission: () => {
    checkHasAudioRecorderPermission: () => Promise<import("..").PermissionStatus>;
    getAudioRecorderPermission: () => Promise<import("..").PermissionStatus>;
    checkHasAudioReadPermission: () => Promise<import("..").PermissionStatus>;
    getAudioReadPermission: () => Promise<import("..").PermissionStatus>;
};
