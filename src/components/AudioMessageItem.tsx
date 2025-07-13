import {
  type IWaveformRef,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { readIcon } from '../img';

// Interface for AudioMessageItem props
export interface AudioMessageItemProps {
  currentMessage: any;
  isCurrentUser: boolean;
  bubbleStyle: any;
  textStyle: any;
  userId: string;
  audioCache?: {[key: string]: string};
  isRemoteUrl?: (path: string) => boolean;
  ensureFileProtocol?: (path: string) => string;
  onAudioDownloaded?: (messageId: string, localPath: string) => void;
}

// Audio message item component with its own state and ref
export const AudioMessageItem = React.memo(
  ({
    currentMessage,
    isCurrentUser,
    bubbleStyle,
    textStyle,
    userId: _userId,

    isRemoteUrl = (path: string) => {
      // Default implementation if not provided
      return (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//') ||
        (!path.startsWith('/') && !path.startsWith('file://'))
      );
    },
    ensureFileProtocol = (path: string) => {
      // Default implementation if not provided
      if (!path) return path;
      // If path already has file:// prefix, remove it
      if (path.startsWith('file://')) return path.substring(7);
      // Otherwise return the original path (likely a remote URL or already correct local path)
      return path;
    },
    onAudioDownloaded,
  }: AudioMessageItemProps) => {
    const ref = useRef<IWaveformRef>(null);
    const [playerState, setPlayerState] = useState('stopped');
    const [isLoading, setIsLoading] = useState(true);
    const [audioCache, setAudioCache] = useState<{[key: string]: string}>({});

    // Function to download audio file
    const downloadAudioFile = async (url: string): Promise<string | null> => {
      // Generate a random filename with the pattern "0.RANDOM_NUMBER.mp3"
      const randomNumber = Math.random();
      const extension = url.split('.').pop()?.toLowerCase() || 'mp3';
      const fileName = `${randomNumber}.${extension}`;

      // Use the cache directory instead of the document directory
      const localFilePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      try {
        const response = await RNFS.downloadFile({
          fromUrl: url,
          toFile: localFilePath,
        }).promise;

        if (response.statusCode === 200) {
          console.log('File downloaded successfully:', localFilePath);
          return localFilePath;
        } else {
          console.error('Failed to download file:', response.statusCode);
          return null;
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        return null;
      }
    };

    // Download audio if it's a remote URL
    useEffect(() => {
      if (
        currentMessage.audio &&
        isRemoteUrl(currentMessage.audio) &&
        !audioCache[currentMessage._id]
      ) {
        // Download the audio file
        downloadAudioFile(currentMessage.audio).then(localPath => {
          if (localPath) {
            // Update local audio cache
            setAudioCache(prev => ({
              ...prev,
              [currentMessage._id]: localPath,
            }));

            // Call the callback to update the parent's audioCache if provided
            if (onAudioDownloaded) {
              onAudioDownloaded(currentMessage._id, localPath);
            }
          }
        });
      }
    }, [
      currentMessage.audio,
      currentMessage._id,
      audioCache,
      isRemoteUrl,
      onAudioDownloaded,
    ]);

    const handlePlayPauseAction = async () => {
      if (!ref.current) return;

      if (playerState === 'playing') {
        // Pause if already playing
        await ref.current.pausePlayer();
      } else if (playerState === 'paused') {
        // Resume if paused
        await ref.current.resumePlayer();
      } else {
        // Start if stopped
        await ref.current.startPlayer();
      }
    };

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}>
        {!isCurrentUser && (
          <Image
            source={{uri: currentMessage.user.avatar}}
            style={styles.messageAvatar}
          />
        )}
        <View style={[styles.messageBubble, bubbleStyle, {width: '80%'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              disabled={isLoading && !audioCache[currentMessage._id]}
              style={styles.playBackControlPressable}
              onPress={handlePlayPauseAction}>
              {isLoading && !audioCache[currentMessage._id] ? (
                <ActivityIndicator
                  color={isCurrentUser ? '#FFFFFF' : '#000000'}
                  size="small"
                />
              ) : (
                <Text
                  style={[
                    styles.audioPlayButtonText,
                    {
                      fontSize: 18,
                      color: isCurrentUser ? '#FFFFFF' : '#000000',
                    },
                  ]}>
                  {playerState === 'playing' ? '■' : '▶'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Waveform */}
            {audioCache[currentMessage._id] && (
              <Waveform
                containerStyle={styles.staticWaveformView}
                mode="static"
                ref={ref}
                path={ensureFileProtocol(audioCache[currentMessage._id])}
                candleSpace={1}
                candleWidth={2.5}
                scrubColor="#F9A61B"
                waveColor={isCurrentUser ? '#D5E0FA' : '#D5E0FA'}
                candleHeightScale={12}
                onPlayerStateChange={setPlayerState}
                onChangeWaveformLoadState={setIsLoading}
              />
            )}
          </View>

          {/* Show text if present */}
          {currentMessage.text ? (
            <Text
              style={[
                textStyle,
                {
                  marginTop: 8,
                },
              ]}>
              {currentMessage.text}
            </Text>
          ) : null}

          <View style={styles.timeContainer}>
            <Text
              style={[styles.timeText, !isCurrentUser && {color: '#6B7280'}]}>
              {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
            {/* Read status icon - only show for messages sent by current user */}
            <Image
                source={readIcon}
                style={[
                  styles.readStatusIcon,
                  {
                    tintColor: currentMessage.read
                      && '#2D65E4'
                      
                  },
                ]}
              />
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  timeText: {
    fontSize: 10,
    color: '#E5E7EB',
    marginRight: 4,
  },
  readStatusIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  staticWaveformView: {
    width:'80%',
    height: 30,
  },
  playBackControlPressable: {
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  audioPlayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
