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
exports.SimpleAudioPlayer = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const SimpleAudioPlayer = ({ uri, fileName, onPlay, onStop, isPlaying, playTime = '00:00:00', }) => {
    const [displayName, setDisplayName] = (0, react_1.useState)(fileName || 'Audio recording');
    // Extract filename from URI if not provided
    (0, react_1.useEffect)(() => {
        if (!fileName && uri) {
            const parts = uri.split('/');
            const name = parts[parts.length - 1];
            setDisplayName(name);
        }
    }, [fileName, uri]);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.TouchableOpacity style={styles.playButton} onPress={isPlaying ? onStop : onPlay}>
        <react_native_1.Image source={isPlaying
            ? require('../img/camera.png')
            : require('../img/send.png')} style={styles.playIcon}/>
      </react_native_1.TouchableOpacity>
      <react_native_1.View style={styles.infoContainer}>
        <react_native_1.Text style={styles.fileName} numberOfLines={1}>
          {displayName}
        </react_native_1.Text>
        <react_native_1.Text style={styles.duration}>{playTime}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.SimpleAudioPlayer = SimpleAudioPlayer;
const styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
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
