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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioMessageItem = void 0;
const react_native_audio_waveform_1 = require("@simform_solutions/react-native-audio-waveform");
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_fs_1 = __importDefault(require("react-native-fs"));
const img_1 = require("../img");
// Audio message item component with its own state and ref
exports.AudioMessageItem = react_1.default.memo(({ currentMessage, isCurrentUser, bubbleStyle, textStyle, userId: _userId, isRemoteUrl = (path) => {
    // Default implementation if not provided
    return (path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//') ||
        (!path.startsWith('/') && !path.startsWith('file://')));
}, ensureFileProtocol = (path) => {
    // Default implementation if not provided
    if (!path)
        return path;
    // If path already has file:// prefix, remove it
    if (path.startsWith('file://'))
        return path.substring(7);
    // Otherwise return the original path (likely a remote URL or already correct local path)
    return path;
}, onAudioDownloaded, }) => {
    const ref = (0, react_1.useRef)(null);
    const [playerState, setPlayerState] = (0, react_1.useState)('stopped');
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [audioCache, setAudioCache] = (0, react_1.useState)({});
    // Function to download audio file
    const downloadAudioFile = async (url) => {
        var _a;
        // Generate a random filename with the pattern "0.RANDOM_NUMBER.mp3"
        const randomNumber = Math.random();
        const extension = ((_a = url.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'mp3';
        const fileName = `${randomNumber}.${extension}`;
        // Use the cache directory instead of the document directory
        const localFilePath = `${react_native_fs_1.default.CachesDirectoryPath}/${fileName}`;
        try {
            const response = await react_native_fs_1.default.downloadFile({
                fromUrl: url,
                toFile: localFilePath,
            }).promise;
            if (response.statusCode === 200) {
                console.log('File downloaded successfully:', localFilePath);
                return localFilePath;
            }
            else {
                console.error('Failed to download file:', response.statusCode);
                return null;
            }
        }
        catch (error) {
            console.error('Error downloading file:', error);
            return null;
        }
    };
    // Download audio if it's a remote URL
    (0, react_1.useEffect)(() => {
        if (currentMessage.audio &&
            isRemoteUrl(currentMessage.audio) &&
            !audioCache[currentMessage._id]) {
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
        if (!ref.current)
            return;
        if (playerState === 'playing') {
            // Pause if already playing
            await ref.current.pausePlayer();
        }
        else if (playerState === 'paused') {
            // Resume if paused
            await ref.current.resumePlayer();
        }
        else {
            // Start if stopped
            await ref.current.startPlayer();
        }
    };
    return (<react_native_1.View style={[
            styles.messageContainer,
            isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}>
        {!isCurrentUser && (<react_native_1.Image source={{ uri: currentMessage.user.avatar }} style={styles.messageAvatar}/>)}
        <react_native_1.View style={[styles.messageBubble, bubbleStyle, { width: '80%' }]}>
          <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <react_native_1.TouchableOpacity disabled={isLoading && !audioCache[currentMessage._id]} style={styles.playBackControlPressable} onPress={handlePlayPauseAction}>
              {isLoading && !audioCache[currentMessage._id] ? (<react_native_1.ActivityIndicator color={isCurrentUser ? '#FFFFFF' : '#000000'} size="small"/>) : (<react_native_1.Text style={[
                styles.audioPlayButtonText,
                {
                    fontSize: 18,
                    color: isCurrentUser ? '#FFFFFF' : '#000000',
                },
            ]}>
                  {playerState === 'playing' ? '■' : '▶'}
                </react_native_1.Text>)}
            </react_native_1.TouchableOpacity>

            {/* Waveform */}
            {audioCache[currentMessage._id] && (<react_native_audio_waveform_1.Waveform containerStyle={styles.staticWaveformView} mode="static" ref={ref} path={ensureFileProtocol(audioCache[currentMessage._id])} candleSpace={1} candleWidth={2.5} scrubColor="#F9A61B" waveColor={isCurrentUser ? '#D5E0FA' : '#D5E0FA'} candleHeightScale={12} onPlayerStateChange={setPlayerState} onChangeWaveformLoadState={setIsLoading}/>)}
          </react_native_1.View>

          {/* Show text if present */}
          {currentMessage.text ? (<react_native_1.Text style={[
                textStyle,
                {
                    marginTop: 8,
                },
            ]}>
              {currentMessage.text}
            </react_native_1.Text>) : null}

          <react_native_1.View style={styles.timeContainer}>
            <react_native_1.Text style={[styles.timeText, !isCurrentUser && { color: '#6B7280' }]}>
              {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })}
            </react_native_1.Text>
            {/* Read status icon - only show for messages sent by current user */}
            <react_native_1.Image source={img_1.readIcon} style={[
            styles.readStatusIcon,
            {
                tintColor: currentMessage.read
                    && '#2D65E4'
            },
        ]}/>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>);
});
const styles = react_native_1.StyleSheet.create({
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
        width: '80%',
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
