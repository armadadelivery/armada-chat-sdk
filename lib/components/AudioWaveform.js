"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioWaveform = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
/**
 * A component that renders an audio waveform visualization
 */
const AudioWaveform = ({ waveformData, progress, height = 40, playedColor = '#4285F4', unplayedColor = '#E0E0E0', }) => {
    // If no waveform data, return empty view
    if (!waveformData || waveformData.length === 0) {
        return <react_native_1.View style={[styles.container, { height }]}/>;
    }
    // Get screen width to calculate bar width
    const screenWidth = react_native_1.Dimensions.get('window').width;
    // Calculate the width of each bar based on available width and number of data points
    // Subtract 100 to account for padding and other UI elements
    const availableWidth = screenWidth - 100;
    // Limit the number of bars to display based on available width
    // We want each bar to be at least 2px wide with 1px spacing
    const maxBars = Math.floor(availableWidth / 3);
    const dataToUse = waveformData.length > maxBars
        ? waveformData
            .filter((_, i) => i % Math.ceil(waveformData.length / maxBars) === 0)
            .slice(0, maxBars)
        : waveformData;
    const barWidth = Math.max(2, availableWidth / dataToUse.length - 1);
    // Calculate the progress index
    const progressIndex = Math.floor(dataToUse.length * progress);
    return (<react_native_1.View style={[styles.container, { height }]}>
      {dataToUse.map((value, index) => {
            // Normalize the value to be between 0.1 and 1
            const normalizedValue = Math.max(0.1, Math.min(1, value));
            // Calculate the height of the bar
            const barHeight = normalizedValue * height;
            // Determine if this bar is in the played portion
            const isPlayed = index <= progressIndex;
            return (<react_native_1.View key={index} style={[
                    styles.bar,
                    {
                        height: barHeight,
                        width: barWidth,
                        backgroundColor: isPlayed ? playedColor : unplayedColor,
                        marginHorizontal: 0.5,
                    },
                ]}/>);
        })}
    </react_native_1.View>);
};
exports.AudioWaveform = AudioWaveform;
const styles = react_native_1.StyleSheet.create({
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
