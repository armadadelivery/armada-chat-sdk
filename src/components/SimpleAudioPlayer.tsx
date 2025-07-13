import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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

export const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({
  uri,
  fileName,
  onPlay,
  onStop,
  isPlaying,
  playTime = '00:00:00',
}) => {
  const [displayName, setDisplayName] = useState(fileName || 'Audio recording');

  // Extract filename from URI if not provided
  useEffect(() => {
    if (!fileName && uri) {
      const parts = uri.split('/');
      const name = parts[parts.length - 1];
      setDisplayName(name);
    }
  }, [fileName, uri]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={isPlaying ? onStop : onPlay}>
        <Image
          source={
            isPlaying
              ? require('../img/camera.png')
              : require('../img/send.png')
          }
          style={styles.playIcon}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.fileName} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.duration}>{playTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  duration: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});
