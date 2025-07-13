import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

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
export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  waveformData,
  progress,
  height = 40,
  playedColor = '#4285F4',
  unplayedColor = '#E0E0E0',
}) => {
  // If no waveform data, return empty view
  if (!waveformData || waveformData.length === 0) {
    return <View style={[styles.container, {height}]} />;
  }

  // Get screen width to calculate bar width
  const screenWidth = Dimensions.get('window').width;
  // Calculate the width of each bar based on available width and number of data points
  // Subtract 100 to account for padding and other UI elements
  const availableWidth = screenWidth - 100;

  // Limit the number of bars to display based on available width
  // We want each bar to be at least 2px wide with 1px spacing
  const maxBars = Math.floor(availableWidth / 3);
  const dataToUse =
    waveformData.length > maxBars
      ? waveformData
          .filter((_, i) => i % Math.ceil(waveformData.length / maxBars) === 0)
          .slice(0, maxBars)
      : waveformData;

  const barWidth = Math.max(2, availableWidth / dataToUse.length - 1);

  // Calculate the progress index
  const progressIndex = Math.floor(dataToUse.length * progress);

  return (
    <View style={[styles.container, {height}]}>
      {dataToUse.map((value, index) => {
        // Normalize the value to be between 0.1 and 1
        const normalizedValue = Math.max(0.1, Math.min(1, value));
        // Calculate the height of the bar
        const barHeight = normalizedValue * height;
        // Determine if this bar is in the played portion
        const isPlayed = index <= progressIndex;

        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: barHeight,
                width: barWidth,
                backgroundColor: isPlayed ? playedColor : unplayedColor,
                marginHorizontal: 0.5,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
  bar: {
    borderRadius: 1,
  },
});
