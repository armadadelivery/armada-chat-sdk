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
exports.AudioAccessoryItem = void 0;
const react_native_audio_waveform_1 = require("@simform_solutions/react-native-audio-waveform");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
// Audio accessory item component with its own state and ref
exports.AudioAccessoryItem = react_1.default.memo(({ attachment, onRemove }) => {
    const audioRef = (0, react_1.useRef)(null);
    const [playerState, setPlayerState] = (0, react_1.useState)('stopped');
    const handlePlayPauseAction = async () => {
        if (!audioRef.current)
            return;
        if (playerState === 'playing') {
            // Pause if already playing
            await audioRef.current.pausePlayer();
        }
        else if (playerState === 'paused') {
            // Resume if paused
            await audioRef.current.resumePlayer();
        }
        else {
            // Start if stopped
            await audioRef.current.startPlayer();
        }
    };
    return (<react_native_1.View style={styles.attachmentPreviewContainer}>
        <react_native_1.View style={{ flex: 0.85, flexDirection: 'row' }}>
          <react_native_1.View style={styles.audioControlsContainer}>
            <react_native_1.TouchableOpacity style={styles.audioPlayButton} onPress={handlePlayPauseAction}>
              <react_native_1.Text style={styles.audioPlayButtonText}>
                {playerState === 'playing' ? '■' : '▶'}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <react_native_audio_waveform_1.Waveform containerStyle={{ width: '100%' }} mode="static" ref={audioRef} path={attachment.uri} candleSpace={1} candleWidth={2.5} candleHeightScale={10} waveColor="#D5E0FA" scrubColor="#F7941D" onPlayerStateChange={setPlayerState}/>
        </react_native_1.View>
        <react_native_1.TouchableOpacity style={styles.removeAttachmentButton} onPress={onRemove}>
          <react_native_1.Text style={styles.removeAttachmentButtonText}>×</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
});
const styles = react_native_1.StyleSheet.create({
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
