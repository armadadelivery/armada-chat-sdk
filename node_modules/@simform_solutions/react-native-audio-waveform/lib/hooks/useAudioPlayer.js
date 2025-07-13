import { NativeEventEmitter, NativeModules } from 'react-native';
import { AudioWaveform } from '../AudioWaveform';
import { NativeEvents } from '../constants';
import {} from '../types';
export const useAudioPlayer = () => {
    const audioPlayerEmitter = new NativeEventEmitter(NativeModules.AudioWaveformsEventEmitter);
    const extractWaveformData = (args) => AudioWaveform.extractWaveformData(args);
    const preparePlayer = (args) => AudioWaveform.preparePlayer(args);
    const playPlayer = (args) => AudioWaveform.startPlayer(args);
    const pausePlayer = (args) => AudioWaveform.pausePlayer(args);
    const stopPlayer = (args) => AudioWaveform.stopPlayer(args);
    const seekToPlayer = (args) => AudioWaveform.seekToPlayer(args);
    const setVolume = (args) => AudioWaveform.setVolume(args);
    const stopAllPlayers = () => AudioWaveform.stopAllPlayers();
    const stopAllWaveFormExtractors = () => AudioWaveform.stopAllWaveFormExtractors();
    const stopPlayersAndExtractors = () => Promise.all([stopAllPlayers(), stopAllWaveFormExtractors()]);
    const getDuration = (args) => AudioWaveform.getDuration(args);
    const onDidFinishPlayingAudio = (callback) => audioPlayerEmitter.addListener(NativeEvents.onDidFinishPlayingAudio, result => callback(result));
    const onCurrentDuration = (callback) => audioPlayerEmitter.addListener(NativeEvents.onCurrentDuration, result => callback(result));
    const onCurrentExtractedWaveformData = (callback) => audioPlayerEmitter.addListener(NativeEvents.onCurrentExtractedWaveformData, result => callback(result));
    const onCurrentRecordingWaveformData = (callback) => audioPlayerEmitter.addListener(NativeEvents.onCurrentRecordingWaveformData, result => callback(result));
    const setPlaybackSpeed = (args) => AudioWaveform.setPlaybackSpeed(args);
    const markPlayerAsUnmounted = () => {
        AudioWaveform.markPlayerAsUnmounted();
    };
    return {
        extractWaveformData,
        pausePlayer,
        playPlayer,
        preparePlayer,
        seekToPlayer,
        setVolume,
        stopAllPlayers,
        stopPlayer,
        onDidFinishPlayingAudio,
        onCurrentDuration,
        onCurrentExtractedWaveformData,
        getDuration,
        onCurrentRecordingWaveformData,
        setPlaybackSpeed,
        markPlayerAsUnmounted,
        stopAllWaveFormExtractors,
        stopPlayersAndExtractors,
    };
};
//# sourceMappingURL=useAudioPlayer.js.map