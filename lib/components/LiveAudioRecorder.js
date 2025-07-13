"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveAudioRecorder = void 0;
const react_native_audio_waveform_1 = require("@simform_solutions/react-native-audio-waveform");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const LiveAudioRecorder = props => {
    const { onRecordingComplete, onRecordingStart, waveformRef, waveColor = '#FF4136', candleWidth = 6, candleSpace = 3, } = props;
    // Use the provided waveformRef or create a local one if not provided
    const actualWaveformRef = waveformRef;
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [recordingTime, setRecordingTime] = (0, react_1.useState)(0);
    const [timerInterval, setTimerInterval] = (0, react_1.useState)(null);
    // No need for the onWaveformRef effect anymore since we're using the passed ref directly
    // Clean up timer on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [timerInterval]);
    // Request microphone permission
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
                if (!allGranted) {
                    react_native_1.Alert.alert('Permission Required', 'Audio recording requires microphone permission', [
                        {
                            text: 'OK',
                            onPress: () => {
                                // You could open app settings here
                            },
                        },
                    ]);
                }
                return allGranted;
            }
            catch (error) {
                return false;
            }
        }
        return true;
    }, []);
    const startRecording = async () => {
        try {
            // Request permission first
            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                return;
            }
            // Call onRecordingStart callback if provided
            if (onRecordingStart) {
                onRecordingStart();
            }
            // Set recording state first to update UI immediately
            setIsRecording(true);
            if (actualWaveformRef === null || actualWaveformRef === void 0 ? void 0 : actualWaveformRef.current) {
                // Start recording
                await actualWaveformRef.current.startRecord();
                // Start timer
                setRecordingTime(0);
                const interval = setInterval(() => {
                    setRecordingTime(prev => prev + 100);
                }, 100);
                setTimerInterval(interval);
            }
        }
        catch (error) {
            // If recording fails, reset the recording state
            setIsRecording(false);
            react_native_1.Alert.alert('Error', 'Failed to start recording');
        }
    };
    console.log({});
    // Watch for changes in waveform state
    (0, react_1.useEffect)(() => {
        // Function to check waveform state
        const checkWaveformState = () => {
            if (actualWaveformRef === null || actualWaveformRef === void 0 ? void 0 : actualWaveformRef.current) {
                const currentState = actualWaveformRef.current.currentState;
                // If recording has stopped, handle it
                if (currentState === 'stopped' && isRecording) {
                    // Stop timer
                    if (timerInterval) {
                        clearInterval(timerInterval);
                        setTimerInterval(null);
                    }
                    // Update local state
                    setIsRecording(false);
                    // Get the recorded file path and call the callback
                    actualWaveformRef.current
                        .stopRecord()
                        .then(filePath => {
                        if (onRecordingComplete && filePath) {
                            onRecordingComplete(filePath);
                        }
                    })
                        .catch(error => {
                        react_native_1.Alert.alert('Error', 'Failed to stop recording');
                    });
                }
            }
        };
        // Set up interval to check waveform state
        const stateCheckInterval = setInterval(checkWaveformState, 100);
        // Clean up
        return () => {
            clearInterval(stateCheckInterval);
        };
    }, [isRecording, onRecordingComplete, timerInterval, actualWaveformRef]);
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };
    // When not recording, just show the mic button
    if (!isRecording) {
        return (<react_native_1.View style={{ position: 'relative' }}>
        {/* Hidden waveform to initialize the ref */}
        <react_native_1.View style={{ width: 0, height: 0, overflow: 'hidden' }}>
          <react_native_audio_waveform_1.Waveform ref={waveformRef} mode="live" waveColor={waveColor} candleWidth={candleWidth} candleSpace={candleSpace}/>
        </react_native_1.View>

        {/* Mic button */}
        <react_native_1.TouchableOpacity style={styles.micButton} onPress={startRecording}>
          <react_native_1.View style={styles.micIconContainer}>
            <react_native_1.Text style={styles.micIcon}>🎤</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    // When recording, just show the mic button
    return (<react_native_1.View style={{ position: 'relative' }}>
      {/* Waveform that's recording - visible but with zero height initially */}
      <react_native_1.View style={{
            width: '100%',
            height: 0,
            overflow: 'hidden',
            position: 'absolute',
        }}>
        <react_native_audio_waveform_1.Waveform ref={actualWaveformRef} mode="live" waveColor={waveColor} candleWidth={candleWidth} candleSpace={candleSpace}/>
      </react_native_1.View>

      {/* Mic button for stopping recording */}
      <react_native_1.TouchableOpacity style={[styles.micButton, styles.recordingMicButton]} onPress={() => setIsRecording(false)}>
        <react_native_1.View style={styles.micIconContainer}>
          <react_native_1.Text style={styles.micIcon}>🎤</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
};
exports.LiveAudioRecorder = LiveAudioRecorder;
const styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recordingContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 1,
    },
    slideToCancelText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    waveformContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 10,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#FF4136',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    stopButton: {
        backgroundColor: '#333333',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    micButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingMicButton: {
        backgroundColor: '#FF4136',
    },
    micIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    micIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
});
