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
const database_1 = require("@react-native-firebase/database");
const react_native_1 = require("react-native");
const Chat_1 = require("./Chat");
const img_1 = require("../img");
const ChatWrapper = ({ chatId, userId, userName = '', userAvatar = '', otherUserName, otherUserAvatar, buttonStyle, chatIconStyle, orderId, onBackPress }) => {
    const [isFullScreen, setIsFullScreen] = (0, react_1.useState)(false);
    // State to store dynamically determined other user info
    const [dynamicOtherUserName, setDynamicOtherUserName] = (0, react_1.useState)('');
    // State to track unread messages count
    const [unreadCount, setUnreadCount] = (0, react_1.useState)(0);
    // Animation value for badge pulsing effect
    const badgeAnimation = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    // Initialize databaseRef inside the component
    const databaseRef = (path) => {
        return database_1.firebase
            .app()
            .database('https://armadanow-2b250-default-rtdb.firebaseio.com')
            .ref(path);
    };
    // Effect to listen for unread messages count
    (0, react_1.useEffect)(() => {
        const countUnreadMessages = () => {
            const onValueChange = databaseRef(`/chats/${chatId}`)
                .on('value', (snapshot) => {
                const messagesData = snapshot.val();
                if (messagesData) {
                    let unreadMessagesCount = 0;
                    // Count messages from other users that are not read
                    Object.values(messagesData).forEach((message) => {
                        if (message.user._id !== userId && message.read === false) {
                            unreadMessagesCount++;
                        }
                    });
                    setUnreadCount(unreadMessagesCount);
                }
                else {
                    setUnreadCount(0);
                }
            });
            // Return cleanup function
            return () => databaseRef(`/chats/${chatId}`).off('value', onValueChange);
        };
        // Only listen for unread messages when chat is not open
        if (!isFullScreen) {
            const cleanup = countUnreadMessages();
            return cleanup;
        }
        else {
            // Reset unread count when chat is opened
            setUnreadCount(0);
        }
    }, [chatId, userId, isFullScreen]);
    // Effect to animate badge when unread count changes
    (0, react_1.useEffect)(() => {
        if (unreadCount > 0) {
            // Start pulsing animation
            const pulseAnimation = react_native_1.Animated.loop(react_native_1.Animated.sequence([
                react_native_1.Animated.timing(badgeAnimation, {
                    toValue: 1.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(badgeAnimation, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]));
            pulseAnimation.start();
            // Cleanup function to stop animation
            return () => {
                pulseAnimation.stop();
                badgeAnimation.setValue(1);
            };
        }
        else {
            // Reset animation when no unread messages
            badgeAnimation.setValue(1);
        }
    }, [unreadCount, badgeAnimation]);
    // Effect to extract other user information from messages when modal opens
    (0, react_1.useEffect)(() => {
        if (isFullScreen && !otherUserName) {
            const loadOtherUserInfo = async () => {
                try {
                    // Get messages to extract other user info
                    const snapshot = await databaseRef(`/chats/${chatId}`)
                        .orderByChild('createdAt')
                        .limitToLast(10) // Only get recent messages for efficiency
                        .once('value');
                    const messagesData = snapshot.val();
                    if (messagesData) {
                        // Find the first message from a user that's not the current user
                        const otherUserMessage = Object.values(messagesData).find((message) => message.user._id !== userId);
                        if (otherUserMessage) {
                            setDynamicOtherUserName(otherUserMessage.user.name || '');
                        }
                    }
                }
                catch (error) {
                    // Silently handle error - not critical for functionality
                }
            };
            loadOtherUserInfo();
        }
    }, [isFullScreen, chatId, userId, otherUserName]);
    const openChat = () => {
        setIsFullScreen(true);
    };
    const closeChat = () => {
        if (onBackPress) {
            onBackPress();
        }
        setIsFullScreen(false);
    };
    return (<>
      {/* Button to open chat */}
      <react_native_1.TouchableOpacity style={[styles.chatButton, buttonStyle]} onPress={openChat}>
        <react_native_1.Image source={img_1.chatIcon} style={[styles.chatButtonIcon, chatIconStyle]}/>
        {/* Unread messages badge */}
        {unreadCount > 0 && (<react_native_1.Animated.View style={[
                styles.unreadBadge,
                {
                    transform: [{ scale: badgeAnimation }]
                }
            ]}>
            <react_native_1.Text style={styles.unreadBadgeText}>
              {unreadCount.toString()}
            </react_native_1.Text>
          </react_native_1.Animated.View>)}
      </react_native_1.TouchableOpacity>

      {/* Full-screen modal for chat */}
      <react_native_1.Modal visible={isFullScreen} animationType="slide">
        <react_native_1.SafeAreaView style={styles.modalContainer}>
          <react_native_1.StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"/>

          {/* Custom header with back button */}
          <react_native_1.View style={styles.headerContainer}>
            <react_native_1.TouchableOpacity style={styles.backButton} onPress={closeChat}>
              <react_native_1.Image source={require('../img/chevron-left.png')} style={styles.backIcon}/>
              <react_native_1.Text style={styles.backText}>Back</react_native_1.Text>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={styles.headerTitle}>{otherUserName || dynamicOtherUserName}</react_native_1.Text>
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
    unreadBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#E2574C',
        borderRadius: 12,
        minWidth: 21,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    unreadBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
