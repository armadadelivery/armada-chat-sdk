import React, {useState} from 'react';
import { firebase } from '@react-native-firebase/database';
import {
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
}

export const ChatWrapper: React.FC<ChatWrapperProps> = ({
  chatId,
  userId,
  userName = '',
  userAvatar = '',
  otherUserName = 'Khaled Saeed',
  otherUserAvatar = 'https://picsum.photos/200',
  buttonStyle,
  chatIconStyle,
  orderId,
}) => {
  

  const [isFullScreen, setIsFullScreen] = useState(false);

  const openChat = () => {
    setIsFullScreen(true);
  };

  const closeChat = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      {/* Button to open chat */}
      <TouchableOpacity
        style={[styles.chatButton, buttonStyle]}
        onPress={openChat}>
        <Image source={chatIcon} style={[styles.chatButtonIcon, chatIconStyle]} />
      </TouchableOpacity>

      {/* Full-screen modal for chat */}
      <Modal
        visible={isFullScreen}
        animationType="slide"
        onRequestClose={closeChat}>
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
            <Text style={styles.headerTitle}>{otherUserName}</Text>
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
});
