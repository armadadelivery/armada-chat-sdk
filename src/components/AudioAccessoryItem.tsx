import {
  type IWaveformRef,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform';
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Interface for File type
export interface File {
  uri: string;
  type?: string;
  name?: string;
}

// Interface for AudioAccessoryItem props
export interface AudioAccessoryItemProps {
  attachment: File;
  onRemove: () => void;
}

// Audio accessory item component with its own state and ref
export const AudioAccessoryItem = React.memo(
  ({attachment, onRemove}: AudioAccessoryItemProps) => {
    const audioRef = useRef<IWaveformRef>(null);
    const [playerState, setPlayerState] = useState('stopped');

    const handlePlayPauseAction = async () => {
      if (!audioRef.current) return;

      if (playerState === 'playing') {
        // Pause if already playing
        await audioRef.current.pausePlayer();
      } else if (playerState === 'paused') {
        // Resume if paused
        await audioRef.current.resumePlayer();
      } else {
        // Start if stopped
        await audioRef.current.startPlayer();
      }
    };

    return (
      <View style={styles.attachmentPreviewContainer}>
        <View style={{flex: 0.85, flexDirection: 'row'}}>
          <View style={styles.audioControlsContainer}>
            <TouchableOpacity
              style={styles.audioPlayButton}
              onPress={handlePlayPauseAction}>
              <Text style={styles.audioPlayButtonText}>
                {playerState === 'playing' ? '■' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>

          <Waveform
            containerStyle={{width: '100%'}}
            mode="static"
            ref={audioRef}
            path={attachment.uri}
            candleSpace={1}
            candleWidth={2.5}
            candleHeightScale={10}
            waveColor="#D5E0FA"
            scrubColor="#F7941D"
            onPlayerStateChange={setPlayerState}
          />
        </View>
        <TouchableOpacity
          style={styles.removeAttachmentButton}
          onPress={onRemove}>
          <Text style={styles.removeAttachmentButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  attachmentPreviewContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioPlayButton: {
    // width: 40,
    // height: 40,
    borderRadius: 20,
    //backgroundColor: '#F7941D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  audioPlayButtonText: {
    color: '#F7941D',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 20,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeAttachmentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
