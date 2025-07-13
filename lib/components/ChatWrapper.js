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
exports.ChatWrapper = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Chat_1 = require("./Chat");
const img_1 = require("../img");
const ChatWrapper = ({ chatId, userId, userName = '', userAvatar = '', otherUserName = 'Khaled Saeed', otherUserAvatar = 'https://picsum.photos/200', buttonStyle, chatIconStyle, orderId, }) => {
    const [isFullScreen, setIsFullScreen] = (0, react_1.useState)(false);
    const openChat = () => {
        setIsFullScreen(true);
    };
    const closeChat = () => {
        setIsFullScreen(false);
    };
    return (<>
      {/* Button to open chat */}
      <react_native_1.TouchableOpacity style={[styles.chatButton, buttonStyle]} onPress={openChat}>
        <react_native_1.Image source={img_1.chatIcon} style={[styles.chatButtonIcon, chatIconStyle]}/>
      </react_native_1.TouchableOpacity>

      {/* Full-screen modal for chat */}
      <react_native_1.Modal visible={isFullScreen} animationType="slide" onRequestClose={closeChat}>
        <react_native_1.SafeAreaView style={styles.modalContainer}>
          <react_native_1.StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"/>

          {/* Custom header with back button */}
          <react_native_1.View style={styles.headerContainer}>
            <react_native_1.TouchableOpacity style={styles.backButton} onPress={closeChat}>
              <react_native_1.Image source={require('../img/chevron-left.png')} style={styles.backIcon}/>
              <react_native_1.Text style={styles.backText}>Back</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={styles.headerTitle}>{otherUserName}</react_native_1.Text>
            <react_native_1.View style={styles.headerRight}/>
          </react_native_1.View>

          {/* Chat component */}
          <react_native_1.View style={styles.chatContainer}>
            <Chat_1.Chat chatId={chatId} userId={userId} userName={userName} userAvatar={userAvatar} otherUserName={otherUserName} otherUserAvatar={otherUserAvatar} orderId={orderId} headerComponent={<react_native_1.View />}/>
          </react_native_1.View>
        </react_native_1.SafeAreaView>
      </react_native_1.Modal>
    </>);
};
exports.ChatWrapper = ChatWrapper;
const styles = react_native_1.StyleSheet.create({
    chatButton: {
        backgroundColor: '#2D65E4',
        padding: 12,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    chatButtonIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    backText: {
        fontSize: 16,
        color: '#2D65E4',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerRight: {
        width: 60, // To balance the header
    },
    chatContainer: {
        flex: 1,
    },
});
