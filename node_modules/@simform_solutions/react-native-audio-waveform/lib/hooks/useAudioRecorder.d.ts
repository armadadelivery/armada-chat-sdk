import type { IStartRecording } from '../types';
export declare const useAudioRecorder: () => {
    getDecibel: () => Promise<number>;
    pauseRecording: () => Promise<boolean>;
    resumeRecording: () => Promise<boolean>;
    startRecording: (args?: Partial<IStartRecording>) => Promise<boolean>;
    stopRecording: () => Promise<string[]>;
};
