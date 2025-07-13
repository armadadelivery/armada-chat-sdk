import React from 'react';
interface SimpleAudioPlayerProps {
    /**
     * URI of the audio file to play
     */
    uri: string;
    /**
     * Filename to display
     */
    fileName?: string;
    /**
     * Function to call when play button is pressed
     */
    onPlay: () => void;
    /**
     * Function to call when stop button is pressed
     */
    onStop: () => void;
    /**
     * Whether the audio is currently playing
     */
    isPlaying: boolean;
    /**
     * Current playback time
     */
    playTime?: string;
}
export declare const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps>;
export {};
