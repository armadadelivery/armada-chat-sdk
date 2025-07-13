import { type IWaveformRef } from '@simform_solutions/react-native-audio-waveform';
import React from 'react';
interface LiveAudioRecorderProps {
    /**
     * Callback when recording is complete
     */
    onRecordingComplete?: (filePath: string) => void;
    /**
     * Callback when recording starts
     */
    onRecordingStart?: () => void;
    /**
     * Reference to the waveform component
     */
    waveformRef?: React.RefObject<IWaveformRef>;
    /**
     * Color of the waveform
     */
    waveColor?: string;
    /**
     * Width of each candle in the waveform
     */
    candleWidth?: number;
    /**
     * Space between each candle in the waveform
     */
    candleSpace?: number;
}
export declare const LiveAudioRecorder: React.FC<LiveAudioRecorderProps>;
export {};
