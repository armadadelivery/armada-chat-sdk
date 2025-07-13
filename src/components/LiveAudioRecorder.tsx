import {
  type IWaveformRef,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

export const LiveAudioRecorder: React.FC<LiveAudioRecorderProps> = props => {
  const {
    onRecordingComplete,
    onRecordingStart,
    waveformRef,
    waveColor = '#FF4136',
    candleWidth = 6,
    candleSpace = 3,
  } = props;

  // Use the provided waveformRef or create a local one if not provided
  const actualWaveformRef = waveformRef;
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // No need for the onWaveformRef effect anymore since we're using the passed ref directly

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Request microphone permission
  const requestMicrophonePermission =
    useCallback(async (): Promise<boolean> => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          const allGranted =
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED;

          if (!allGranted) {
            Alert.alert(
              'Permission Required',
              'Audio recording requires microphone permission',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // You could open app settings here
                  },
                },
              ],
            );
          }

          return allGranted;
        } catch (error) {
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

      if (actualWaveformRef?.current) {
        // Start recording
        await actualWaveformRef.current.startRecord();

        // Start timer
        setRecordingTime(0);
        const interval = setInterval(() => {
          setRecordingTime(prev => prev + 100);
        }, 100);
        setTimerInterval(interval);
      }
    } catch (error) {
      // If recording fails, reset the recording state
      setIsRecording(false);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  console.log({});
  // Watch for changes in waveform state
  useEffect(() => {
    // Function to check waveform state
    const checkWaveformState = () => {
      if (actualWaveformRef?.current) {
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
              Alert.alert('Error', 'Failed to stop recording');
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

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // When not recording, just show the mic button
  if (!isRecording) {
    return (
      <View style={{position: 'relative'}}>
        {/* Hidden waveform to initialize the ref */}
        <View style={{width: 0, height: 0, overflow: 'hidden'}}>
          <Waveform
            ref={waveformRef}
            mode="live"
            waveColor={waveColor}
            candleWidth={candleWidth}
            candleSpace={candleSpace}
          />
        </View>

        {/* Mic button */}
        <TouchableOpacity style={styles.micButton} onPress={startRecording}>
          <View style={styles.micIconContainer}>
            <Text style={styles.micIcon}>🎤</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // When recording, just show the mic button
  return (
    <View style={{position: 'relative'}}>
      {/* Waveform that's recording - visible but with zero height initially */}
      <View
        style={{
          width: '100%',
          height: 0,
          overflow: 'hidden',
          position: 'absolute',
        }}>
        <Waveform
          ref={actualWaveformRef}
          mode="live"
          waveColor={waveColor}
          candleWidth={candleWidth}
          candleSpace={candleSpace}
        />
      </View>

      {/* Mic button for stopping recording */}
      <TouchableOpacity
        style={[styles.micButton, styles.recordingMicButton]}
        onPress={() => setIsRecording(false)}>
        <View style={styles.micIconContainer}>
          <Text style={styles.micIcon}>🎤</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
