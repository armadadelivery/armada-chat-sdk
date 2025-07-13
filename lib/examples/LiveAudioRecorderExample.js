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
exports.LiveAudioRecorderExample = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const LiveAudioRecorder_1 = require("../components/LiveAudioRecorder");
const LiveAudioRecorderExample = () => {
    const [recordedFilePath, setRecordedFilePath] = (0, react_1.useState)(null);
    const handleRecordingComplete = (filePath) => {
        setRecordedFilePath(filePath);
    };
    return (<react_native_1.SafeAreaView style={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.Text style={styles.title}>Live Audio Recorder Example</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>
          Record audio with real-time waveform visualization
        </react_native_1.Text>

        <react_native_1.View style={styles.recorderContainer}>
          <LiveAudioRecorder_1.LiveAudioRecorder onRecordingComplete={handleRecordingComplete} waveColor="#FF4136" height={120} candleWidth={4} candleSpace={2}/>
        </react_native_1.View>

        {recordedFilePath && (<react_native_1.View style={styles.resultContainer}>
            <react_native_1.Text style={styles.resultTitle}>Recording Saved</react_native_1.Text>
            <react_native_1.Text style={styles.resultPath}>{recordedFilePath}</react_native_1.Text>
            <react_native_1.TouchableOpacity style={styles.resetButton} onPress={() => setRecordedFilePath(null)}>
              <react_native_1.Text style={styles.resetButtonText}>Reset</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
};
exports.LiveAudioRecorderExample = LiveAudioRecorderExample;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 30,
    },
    recorderContainer: {
        marginBottom: 30,
    },
    resultContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    resultPath: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 15,
    },
    resetButton: {
        backgroundColor: '#333333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-end',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
