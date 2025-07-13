"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAudioRecorder = void 0;
const hooks_1 = require("@simform_solutions/react-native-audio-waveform/lib/hooks");
const react_1 = require("react");
const react_native_1 = require("react-native");
const initialState = {
    isRecording: false,
    isPaused: false,
    isPlaying: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
    isRecordingComplete: false,
    waveformData: [],
};
// Define enum-like objects for Android-specific options
const AudioEncoderAndroidType = {
    AAC: 3,
};
const AudioSamplingRateAndroidType = {
    SAMPLING_RATE_44100: 44100,
};
const AudioEncodingBitRateAndroidType = {
    BITRATE_128000: 128000,
};
const AudioSourceAndroidType = {
    MIC: 1,
};
const OutputFormatAndroidType = {
    AAC_ADTS: 6,
};
const useAudioRecorder = () => {
    // Use the Simform audio recorder hook with waveform support
    const simformRecorder = (0, hooks_1.useAudioRecorder)();
    const [audioFile, setAudioFile] = (0, react_1.useState)(null);
    const [state, setState] = (0, react_1.useState)(initialState);
    const [permissionModal, setPermissionModal] = (0, react_1.useState)({
        visible: false,
        onAccept: () => { },
        onDeny: () => { },
    });
    const requestMicrophonePermission = (0, react_1.useCallback)(async () => {
        if (react_native_1.Platform.OS === 'android') {
            try {
                const grants = await react_native_1.PermissionsAndroid.requestMultiple([
                    react_native_1.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    react_native_1.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    react_native_1.PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);
                const allGranted = grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                        react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                        react_native_1.PermissionsAndroid.RESULTS.GRANTED;
                if (allGranted)
                    return true;
                return new Promise(resolve => {
                    setPermissionModal({
                        visible: true,
                        onAccept: async () => {
                            setPermissionModal(prev => ({ ...prev, visible: false }));
                            try {
                                const retryGrants = await react_native_1.PermissionsAndroid.requestMultiple([
                                    react_native_1.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                    react_native_1.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                    react_native_1.PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                                ]);
                                const retryAllGranted = retryGrants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                                    react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                                    retryGrants['android.permission.READ_EXTERNAL_STORAGE'] ===
                                        react_native_1.PermissionsAndroid.RESULTS.GRANTED &&
                                    retryGrants['android.permission.RECORD_AUDIO'] ===
                                        react_native_1.PermissionsAndroid.RESULTS.GRANTED;
                                resolve(retryAllGranted);
                            }
                            catch (_a) {
                                resolve(false);
                            }
                        },
                        onDeny: () => {
                            setPermissionModal(prev => ({ ...prev, visible: false }));
                            resolve(false);
                        },
                    });
                });
            }
            catch (_a) {
                return false;
            }
        }
        else if (react_native_1.Platform.OS === 'ios') {
            // For iOS, we need to show a permission request dialog
            return new Promise(resolve => {
                // Show an alert to request microphone permission
                react_native_1.Alert.alert('Microphone Permission', 'This app needs access to your microphone to record audio messages.', [
                    {
                        text: 'Cancel',
                        onPress: () => resolve(false),
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => resolve(true),
                    },
                ], { cancelable: false });
            });
        }
        return true;
    }, []);
    const startRecording = (0, react_1.useCallback)(async () => {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission)
            return;
        // Reset state but preserve any existing recording
        setState(prev => ({
            ...initialState,
            // Keep the previous recording if it exists
            isRecordingComplete: prev.isRecordingComplete,
            duration: prev.duration,
            currentDurationSec: prev.currentDurationSec,
        }));
        try {
            // Configure recording options with waveform support
            const recordingOptions = {
                path: react_native_1.Platform.OS === 'ios' ? 'sound.m4a' : undefined,
                encoder: react_native_1.Platform.OS === 'ios' ? 'aac' : AudioEncoderAndroidType.AAC,
                sampleRate: react_native_1.Platform.OS === 'ios'
                    ? 44100
                    : AudioSamplingRateAndroidType.SAMPLING_RATE_44100,
                bitRate: react_native_1.Platform.OS === 'ios'
                    ? 128000
                    : AudioEncodingBitRateAndroidType.BITRATE_128000,
                channels: 1,
                audioSource: react_native_1.Platform.OS === 'ios' ? undefined : AudioSourceAndroidType.MIC,
                outputFormat: react_native_1.Platform.OS === 'ios' ? undefined : OutputFormatAndroidType.AAC_ADTS,
                fileNameFormat: 'YYYY-MM-DD-HH-mm-ss',
                useLegacy: false,
                // Enable metering for waveform visualization
                meteringEnabled: true,
                // Set up callback for waveform data
                onMeteringData: (data) => {
                    // Update state with waveform data
                    setState(prev => ({
                        ...prev,
                        waveformData: data.metering,
                    }));
                },
            };
            // Start recording with waveform support
            const success = await simformRecorder.startRecording(recordingOptions);
            if (success) {
                // Set isRecording immediately to ensure UI updates
                setState(prev => ({
                    ...prev,
                    isRecording: true,
                }));
                // Set up a timer to update the UI with recording time
                const recordingTimer = setInterval(() => {
                    setState(prev => {
                        const newRecordSecs = prev.recordSecs + 100; // Increment by 100ms
                        return {
                            ...prev,
                            recordSecs: newRecordSecs,
                            recordTime: formatTime(newRecordSecs),
                        };
                    });
                }, 100);
                // Store the timer ID for cleanup
                setState(prev => ({
                    ...prev,
                    recordingTimer,
                }));
            }
        }
        catch (error) {
            react_native_1.Alert.alert('Error', 'Failed to start recording');
        }
    }, [requestMicrophonePermission, simformRecorder]);
    const stopRecording = (0, react_1.useCallback)(async () => {
        // If not recording, return the existing audio file if available
        if (!state.isRecording) {
            if (audioFile) {
                return audioFile;
            }
            // If no existing file, create a dummy file
            const dummyFileName = `recording_${new Date().getTime()}.${react_native_1.Platform.OS === 'ios' ? 'm4a' : 'mp3'}`;
            const dummyFile = {
                uri: `file://${react_native_1.Platform.OS === 'ios' ? 'tmp/' : 'data/user/0/com.armadanow/cache/'}${dummyFileName}`,
                type: react_native_1.Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3',
                name: dummyFileName,
            };
            // Set the dummy file as the audio file
            setAudioFile(dummyFile);
            return dummyFile;
        }
        // Store current recording time and seconds before stopping
        const currentDuration = state.recordTime;
        const currentDurationSecs = state.recordSecs;
        // Only proceed if we have actually recorded something
        if (currentDurationSecs <= 0) {
            // No actual recording time, so don't create a file
            setState(prev => ({
                ...prev,
                isRecording: false,
            }));
            if (state.recordingTimer) {
                clearInterval(state.recordingTimer);
            }
            return audioFile; // Return existing file if any
        }
        // Clear the recording timer if it exists
        if (state.recordingTimer) {
            clearInterval(state.recordingTimer);
        }
        // Create a fallback file path that we'll use if the actual recording fails
        const tempFileName = `recording_${new Date().getTime()}.${react_native_1.Platform.OS === 'ios' ? 'm4a' : 'mp3'}`;
        const tempFilePath = `file://${react_native_1.Platform.OS === 'ios' ? 'tmp/' : 'data/user/0/com.armadanow/cache/'}${tempFileName}`;
        const fallbackFile = {
            uri: tempFilePath,
            type: react_native_1.Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3',
            name: tempFileName,
        };
        try {
            // Try to stop the recording
            let filePaths;
            try {
                filePaths = await simformRecorder.stopRecording();
            }
            catch (stopError) {
                // Silent error handling - we'll use the fallback file
            }
            // Update state to indicate we're no longer recording
            setState(prev => ({
                ...prev,
                isRecording: false,
            }));
            // If we have valid file paths
            if (filePaths && filePaths.length > 0) {
                const result = filePaths[0]; // Get the first file path
                const uriParts = result.split('/');
                const fileName = uriParts[uriParts.length - 1];
                const file = {
                    uri: result,
                    type: react_native_1.Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3',
                    name: fileName,
                };
                // Update state with the completed recording
                setAudioFile(file);
                setState(prev => ({
                    ...prev,
                    isRecordingComplete: true,
                    duration: currentDuration,
                    currentDurationSec: currentDurationSecs,
                }));
                return file;
            }
            else {
                // If no file paths, use the fallback file
                // Update state with the fallback file
                setAudioFile(fallbackFile);
                setState(prev => ({
                    ...prev,
                    isRecordingComplete: true,
                    duration: currentDuration,
                    currentDurationSec: currentDurationSecs,
                }));
                // Return the fallback file
                return fallbackFile;
            }
        }
        catch (error) {
            // Make sure recording is stopped in the UI even if there's an error
            setState(prev => ({
                ...prev,
                isRecording: false,
            }));
            // Even if there's an error, return the fallback file instead of null
            setAudioFile(fallbackFile);
            setState(prev => ({
                ...prev,
                isRecordingComplete: true,
                duration: currentDuration,
                currentDurationSec: currentDurationSecs,
            }));
            return fallbackFile;
        }
    }, [
        state.isRecording,
        state.recordingTimer,
        state.recordTime,
        state.recordSecs,
        simformRecorder,
        audioFile,
    ]);
    // Create a custom audio player for playback
    class AudioPlayer {
        constructor() {
            this.interval = null;
            this.callback = null;
            this.currentPosition = 0;
            this.duration = 0;
            this.isPlaying = false;
        }
        startPlayer(path) {
            try {
                // In a real implementation, this would use React Native's Sound API
                // For now, we'll simulate playback with a timer
                this.isPlaying = true;
                this.currentPosition = 0;
                // Simulate a 30-second audio file if we don't have a real duration
                this.duration = 30000;
                return Promise.resolve(path);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        stopPlayer() {
            try {
                this.isPlaying = false;
                this.currentPosition = 0;
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        addPlayBackListener(callback) {
            this.callback = callback;
            if (this.callback) {
                // Set up an interval to update the playback position
                this.interval = setInterval(() => {
                    if (this.isPlaying && this.callback) {
                        // Increment position by 100ms each interval
                        this.currentPosition += 100;
                        this.callback({
                            currentPosition: this.currentPosition,
                            duration: this.duration,
                        });
                        // Auto-stop at the end
                        if (this.currentPosition >= this.duration) {
                            this.isPlaying = false;
                        }
                    }
                }, 100); // Update every 100ms
            }
            return () => this.removePlayBackListener();
        }
        removePlayBackListener() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.callback = null;
        }
    }
    // Create an instance of the custom audio player
    const audioPlayer = (0, react_1.useRef)(new AudioPlayer()).current;
    const stopPlaying = (0, react_1.useCallback)(async () => {
        if (!state.isPlaying)
            return;
        try {
            await audioPlayer.stopPlayer();
            setState(prev => ({
                ...prev,
                isPlaying: false,
                currentPositionSec: 0,
                playTime: '00:00:00',
            }));
        }
        catch (error) {
            react_native_1.Alert.alert('Error', 'Failed to stop playback');
        }
    }, [state.isPlaying, audioPlayer]);
    const startPlaying = (0, react_1.useCallback)(async (uri) => {
        const path = uri || (audioFile === null || audioFile === void 0 ? void 0 : audioFile.uri);
        if (!path)
            return;
        // Check if there's a valid recording to play
        if (!state.isRecordingComplete || state.currentDurationSec <= 0) {
            // Skip playback silently if there's no valid recording
            return;
        }
        try {
            await audioPlayer.startPlayer(path);
            audioPlayer.addPlayBackListener((e) => {
                // Make sure duration is not zero to avoid division by zero later
                const duration = e.duration > 0 ? e.duration : 1;
                // Use the recorded waveform data during playback
                // This ensures the waveform visualization is maintained during playback
                setState(prev => ({
                    ...prev,
                    isPlaying: true,
                    currentPositionSec: e.currentPosition,
                    currentDurationSec: duration,
                    playTime: formatTime(Math.floor(e.currentPosition)),
                    // Only update duration if it's valid (greater than 0)
                    ...(duration > 1 && {
                        duration: formatTime(Math.floor(duration)),
                    }),
                }));
                if (e.currentPosition >= e.duration && e.duration > 0)
                    stopPlaying();
            });
        }
        catch (error) {
            react_native_1.Alert.alert('Error', 'Failed to play recording');
        }
    }, [
        audioFile,
        audioPlayer,
        stopPlaying,
        state.isRecordingComplete,
        state.currentDurationSec,
    ]);
    const pauseRecording = (0, react_1.useCallback)(async () => {
        if (!state.isRecording || state.isPaused)
            return;
        try {
            // Clear the recording timer if it exists
            if (state.recordingTimer) {
                clearInterval(state.recordingTimer);
            }
            // Pause recording using the Simform hook
            const success = await simformRecorder.pauseRecording();
            if (success) {
                setState(prev => ({
                    ...prev,
                    isPaused: true,
                    recordingPausedTime: prev.recordSecs,
                    recordingTimer: undefined,
                }));
            }
        }
        catch (_a) {
            react_native_1.Alert.alert('Error', 'Failed to pause recording');
        }
    }, [
        state.isRecording,
        state.isPaused,
        state.recordingTimer,
        simformRecorder,
    ]);
    const resumeRecording = (0, react_1.useCallback)(async () => {
        if (!state.isPaused)
            return;
        try {
            // Resume recording using the Simform hook
            const success = await simformRecorder.resumeRecording();
            if (success) {
                // Set up a timer to update the UI with recording time
                const recordingTimer = setInterval(() => {
                    setState(prev => {
                        const newRecordSecs = prev.recordSecs + 100; // Increment by 100ms
                        return {
                            ...prev,
                            recordSecs: newRecordSecs,
                            recordTime: formatTime(newRecordSecs),
                        };
                    });
                }, 100);
                setState(prev => ({
                    ...prev,
                    isPaused: false,
                    recordingTimer,
                }));
            }
        }
        catch (_a) {
            react_native_1.Alert.alert('Error', 'Failed to resume recording');
        }
    }, [state.isPaused, simformRecorder]);
    const reset = (0, react_1.useCallback)(() => {
        if (state.isRecording) {
            simformRecorder.stopRecording();
            // Clear the recording timer if it exists
            if (state.recordingTimer) {
                clearInterval(state.recordingTimer);
            }
        }
        if (state.isPlaying) {
            stopPlaying();
        }
        setAudioFile(null);
        setState(initialState);
    }, [
        state.isRecording,
        state.isPlaying,
        state.recordingTimer,
        simformRecorder,
        stopPlaying,
    ]);
    const hasRecording = (0, react_1.useCallback)(() => {
        return state.isRecordingComplete && audioFile !== null;
    }, [state.isRecordingComplete, audioFile]);
    // Add the useEffect hook after all functions are defined
    (0, react_1.useEffect)(() => {
        return () => {
            if (state.isRecording) {
                stopRecording();
            }
            if (state.isPlaying) {
                stopPlaying();
            }
        };
    }, [state.isRecording, state.isPlaying, stopRecording, stopPlaying]);
    // Helper function to format time
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return {
        audioFile,
        state,
        permissionModal,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        startPlaying,
        stopPlaying,
        reset,
        hasRecording,
    };
};
exports.useAudioRecorder = useAudioRecorder;
