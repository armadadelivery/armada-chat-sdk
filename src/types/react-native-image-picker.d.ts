declare module 'react-native-image-picker' {
  export interface ImagePickerResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Array<{
      uri?: string;
      width?: number;
      height?: number;
      fileName?: string;
      fileSize?: number;
      type?: string;
      base64?: string;
    }>;
  }

  export interface ImageLibraryOptions {
    mediaType: 'photo' | 'video' | 'mixed';
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    includeBase64?: boolean;
    selectionLimit?: number;
  }

  export interface CameraOptions extends ImageLibraryOptions {
    saveToPhotos?: boolean;
    cameraType?: 'front' | 'back';
  }

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;

  export function launchCamera(
    options: CameraOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}
