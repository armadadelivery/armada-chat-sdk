/// <reference types="node" />
import { File } from './useUploadAttachments';
interface AudioRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    isPlaying: boolean;
    recordSecs: number;
    recordTime: string;
    currentPositionSec: number;
    currentDurationSec: number;
    playTime: string;
    duration: string;
    isRecordingComplete: boolean;
    recordingPausedTime?: number;
    recordingTimer?: NodeJS.Timeout;
    waveformData?: number[];
}
interface PermissionModalState {
    visible: boolean;
    onAccept: () => void;
    onDeny: () => void;
}
export declare const useAudioRecorder: () => {
    audioFile: File | null;
    state: AudioRecorderState;
    permissionModal: PermissionModalState;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<File | null>;
    pauseRecording: () => Promise<void>;
    resumeRecording: () => Promise<void>;
    startPlaying: (uri?: string) => Promise<void>;
    stopPlaying: () => Promise<void>;
    reset: () => void;
    hasRecording: () => boolean;
};
export {};
