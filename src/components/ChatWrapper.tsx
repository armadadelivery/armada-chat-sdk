import React, {useState, useEffect, useRef} from 'react';
import { firebase } from '@react-native-firebase/database';
import {
  Animated,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Chat} from './Chat';
import {chatIcon} from '../img';

interface ChatWrapperProps {
  /**
   * The unique identifier for the chat room
   */
  chatId: string;
  /**
   * The current user's ID
   */
  userId: string;
  /**
   * The current user's name (optional)
   */
  userName?: string;
  /**
   * The current user's avatar URL (optional)
   */
  userAvatar?: string;
  /**
   * The other user's name (optional)
   */
  otherUserName?: string;
  /**
   * The other user's avatar URL (optional)
   */
  otherUserAvatar?: string;
  /**
   * Button style (optional)
   */
  buttonStyle?: object;
  /**
   * Chat icon style (optional)
   */
  chatIconStyle?: object;
  /**
   * Order ID for the chat (optional)
   */
  orderId?: string;

  /**
   * Callback for when the back button is pressed (optional)
   */
  onBackPress?: () => void;
  
}

export const ChatWrapper: React.FC<ChatWrapperProps> = ({
  chatId,
  userId,
  userName = '',
  userAvatar = '',
  otherUserName,
  otherUserAvatar,
  buttonStyle,
  chatIconStyle,
  orderId,
  onBackPress
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  // State to store dynamically determined other user info
  const [dynamicOtherUserName, setDynamicOtherUserName] = useState<string>('');
  // State to track unread messages count
  const [unreadCount, setUnreadCount] = useState<number>(0);
  // Animation value for badge pulsing effect
  const badgeAnimation = useRef(new Animated.Value(1)).current;

  // Initialize databaseRef inside the component
  const databaseRef = (path: string) => {
    return firebase
      .app()
      .database('https://armadanow-2b250-default-rtdb.firebaseio.com')
      .ref(path);
  };

  // Effect to listen for unread messages count
  useEffect(() => {
    const countUnreadMessages = () => {
      const onValueChange = databaseRef(`/chats/${chatId}`)
        .on('value', (snapshot: any) => {
          const messagesData = snapshot.val();
          if (messagesData) {
            let unreadMessagesCount = 0;
            
            // Count messages from other users that are not read
            Object.values(messagesData).forEach((message: any) => {
              if (message.user._id !== userId && message.read === false) {
                unreadMessagesCount++;
              }
            });
            
            setUnreadCount(unreadMessagesCount);
          } else {
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
    } else {
      // Reset unread count when chat is opened
      setUnreadCount(0);
    }
  }, [chatId, userId, isFullScreen]);

  // Effect to animate badge when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(badgeAnimation, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(badgeAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Cleanup function to stop animation
      return () => {
        pulseAnimation.stop();
        badgeAnimation.setValue(1);
      };
    } else {
      // Reset animation when no unread messages
      badgeAnimation.setValue(1);
    }
  }, [unreadCount, badgeAnimation]);

  // Effect to extract other user information from messages when modal opens
  useEffect(() => {
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
            const otherUserMessage = Object.values(messagesData).find(
              (message: any) => message.user._id !== userId
            );

            if (otherUserMessage) {
              setDynamicOtherUserName((otherUserMessage as any).user.name || '');
            }
          }
        } catch (error) {
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
    if(onBackPress){
    onBackPress();
    }
    setIsFullScreen(false);
  };

  return (
    <>
      {/* Button to open chat */}
      <TouchableOpacity
        style={[styles.chatButton, buttonStyle]}
        onPress={openChat}>
        <Image source={chatIcon} style={[styles.chatButtonIcon, chatIconStyle]} />
        {/* Unread messages badge */}
        {unreadCount > 0 && (
          <Animated.View 
            style={[
              styles.unreadBadge,
              {
                transform: [{ scale: badgeAnimation }]
              }
            ]}
          >
            <Text style={styles.unreadBadgeText}>
              {unreadCount.toString()}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Full-screen modal for chat */}
      <Modal
        visible={isFullScreen}
        animationType="slide"
        >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Custom header with back button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={closeChat}>
              <Image
                source={require('../img/chevron-left.png')}
                style={styles.backIcon}
              />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{otherUserName || dynamicOtherUserName}</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Chat component */}
          <View style={styles.chatContainer}>
            <Chat
              chatId={chatId}
              userId={userId}
              userName={userName}
              userAvatar={userAvatar}
              otherUserName={otherUserName}
              otherUserAvatar={otherUserAvatar}
              orderId={orderId}
              headerComponent={<View />}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
