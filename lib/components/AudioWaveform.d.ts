import React from 'react';
interface AudioWaveformProps {
    /**
     * Array of waveform data points (typically between 0 and 1)
     */
    waveformData: number[];
    /**
     * Current playback progress (0 to 1)
     */
    progress: number;
    /**
     * Height of the waveform
     */
    height?: number;
    /**
     * Color of the played portion of the waveform
     */
    playedColor?: string;
    /**
     * Color of the unplayed portion of the waveform
     */
    unplayedColor?: string;
}
/**
 * A component that renders an audio waveform visualization
 */
export declare const AudioWaveform: React.FC<AudioWaveformProps>;
export {};
