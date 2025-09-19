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
exports.Chat = exports.listenForNewMessages = void 0;
const react_native_audio_waveform_1 = require("@simform_solutions/react-native-audio-waveform");
const react_1 = __importStar(require("react"));
const database_1 = require("@react-native-firebase/database");
const react_native_1 = require("react-native");
const img_1 = require("../img");
const react_native_fs_1 = __importDefault(require("react-native-fs"));
const react_native_gifted_chat_1 = require("react-native-gifted-chat");
const ImagePicker = __importStar(require("react-native-image-picker"));
const useAudioRecorder_1 = require("../hooks/useAudioRecorder");
const useUploadAttachments_1 = require("../hooks/useUploadAttachments");
const AudioAccessoryItem_1 = require("./AudioAccessoryItem");
const AudioMessageItem_1 = require("./AudioMessageItem");
/**
 * Standalone function for listening to new messages using child_added event
 *
 * This function can be used outside the Chat component to listen for new messages
 * in a specific chat. It's useful for notifications or other features that need
 * to react to new messages without loading the entire chat history.
 *
 * @param databaseRef - Firebase database reference function
 * @param chatId - The chat ID to listen to
 * @param callback - Callback function that receives the new message
 * @returns A function to unsubscribe from the listener
 */
const listenForNewMessages = (chatId, callback) => {
    // Initialize databaseRef inside the function
    const databaseRef = (path) => {
        return database_1.firebase
            .app()
            .database('https://armadanow-2b250-default-rtdb.firebaseio.com')
            .ref(path);
    };
    // Listen only for new child nodes being added, ordered by createdAt
    const onChildAdded = databaseRef(`/chats/${chatId}`)
        .orderByChild('createdAt')
        .on('child_added', (snapshot) => {
        const message = snapshot.val();
        if (message) {
            // Pass the new message to the callback function
            callback(message);
        }
    });
    // Return a function to remove the listener
    return () => databaseRef(`/chats/${chatId}`).off('child_added', onChildAdded);
};
exports.listenForNewMessages = listenForNewMessages;
const Chat = ({ chatId, userId, userName = '', userAvatar = '', otherUserName, otherUserAvatar, headerComponent, containerStyle, placeholder = 'Type a message', showCamera = true, showGallery = true, onBackPress, onCallPress, orderId = '6849cbbf4264200046301370', }) => {
    // Initialize databaseRef inside the component
    const databaseRef = (path) => {
        return database_1.firebase
            .app()
            .database('https://armadanow-2b250-default-rtdb.firebaseio.com')
            .ref(path);
    };
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [attachment, setAttachment] = (0, react_1.useState)(null);
    // State to store dynamically determined other user info
    const [dynamicOtherUserName, setDynamicOtherUserName] = (0, react_1.useState)('');
    const [dynamicOtherUserAvatar, setDynamicOtherUserAvatar] = (0, react_1.useState)('');
    const uploadAttachmentsMutation = (0, useUploadAttachments_1.useUploadAttachments)();
    const pendingMessageRef = (0, react_1.useRef)(null);
    const waveformRef = (0, react_1.useRef)(null);
    const liveWaveformRef = (0, react_1.useRef)(null);
    // Reference to the hidden waveform for recording
    const hiddenWaveformRef = (0, react_1.useRef)(null);
    const [isTyping, _setIsTyping] = (0, react_1.useState)(false);
    // Using _attachmentPreview to indicate it's intentionally unused in some places
    const [_attachmentPreview, setAttachmentPreview] = (0, react_1.useState)(null);
    if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log({ _attachmentPreview });
    }
    // Audio recording state
    const { state: _audioState, 
    // We need these functions for recording and playback
    startRecording, stopPlaying, reset: resetAudio, } = (0, useAudioRecorder_1.useAudioRecorder)();
    // Audio state
    const [isPlayingAudio, _setIsPlayingAudio] = (0, react_1.useState)(false);
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    // Effect to extract other user information from messages
    (0, react_1.useEffect)(() => {
        if (messages.length > 0 && !otherUserName && !otherUserAvatar) {
            // Find the first message from a user that's not the current user
            const otherUserMessage = messages.find(message => message.user._id !== userId);
            if (otherUserMessage) {
                setDynamicOtherUserName(otherUserMessage.user.name || '');
                setDynamicOtherUserAvatar(otherUserMessage.user.avatar || '');
            }
        }
    }, [messages, userId, otherUserName, otherUserAvatar]);
    // Effect to update isPlayingAudio state based on audioState
    (0, react_1.useEffect)(() => {
        /**
         * WHEN TO FETCH ALL DATA AT ONCE:
         * Use the 'once' method when:
         * 1. You need to load initial/historical data that doesn't change frequently
         * 2. You want to reduce database reads for performance optimization
         * 3. You're loading a large dataset that you only need to display once
         * 4. You want to get a snapshot of data at a specific point in time
         *
         * In this case, we're using 'once' to load the initial chat history
         * before setting up real-time listeners.
         */
        // Load all messages at once when the chat is opened
        const loadAllMessages = async () => {
            try {
                // Get all messages in a single operation, ordered by createdAt on the server side
                const snapshot = await databaseRef(`/chats/${chatId}`)
                    .orderByChild('createdAt')
                    .once('value');
                const messagesData = snapshot.val();
                // Log message data for debugging (commented out to comply with ESLint)
                // console.log({messagesData});
                if (messagesData) {
                    const messagesList = [];
                    const processedIds = new Set();
                    // Process all messages
                    Object.entries(messagesData).forEach(([key, value]) => {
                        const message = value;
                        // Mark messages from other users as read when loaded
                        if (message.user._id !== userId && !message.read) {
                            // Update the message in Firebase to mark it as read
                            databaseRef(`/chats/${chatId}/${key}`).update({
                                read: true,
                            });
                            // Update the message object to reflect read status
                            message.read = true;
                        }
                        messagesList.push(message);
                        processedIds.add(key);
                    });
                    /**
                     * WHEN TO USE SORTING WITH ORDERING:
                     * Use sorting with ordering when:
                     * 1. You need data displayed in a specific order (e.g., by timestamp)
                     * 2. You want consistent ordering across app sessions
                     * 3. You need to implement pagination or limit results
                     * 4. You're working with large datasets and need to optimize queries
                     *
                     * We're using server-side ordering with orderByChild('createdAt')
                     * which is more efficient than client-side sorting, especially for large datasets.
                     * The data comes pre-sorted from the server.
                     */
                    // No need for client-side sorting as we're using orderByChild on the server side
                    // Update state with all messages at once
                    setMessages(messagesList);
                }
            }
            catch (error) {
                // Handle error with Alert
                react_native_1.Alert.alert('Error', 'Failed to load messages. Please try again.');
            }
        };
        // Load all messages initially
        loadAllMessages();
        /**
         * Real-time updates using 'value' event:
         * The 'value' event is triggered once with the initial data and again
         * whenever the data changes. This is useful for:
         * 1. Keeping UI in sync with database changes
         * 2. Displaying real-time updates to users
         * 3. Building collaborative features
         */
        /**
         * USING onChildAdded EVENT:
         * The 'child_added' event is triggered once for each existing child and again
         * every time a new child is added to the specified path. This is useful for:
         * 1. Building chat applications where you want to append new messages
         * 2. Creating feeds or timelines where new items are added over time
         * 3. Implementing real-time notifications for new data
         * 4. Optimizing performance by only processing new items
         *
         * Note: When using both 'value' and 'child_added' listeners, you need to
         * handle potential duplicates as we do below.
         */
        const onChildAdded = databaseRef(`/chats/${chatId}`)
            .orderByChild('createdAt')
            .on('child_added', (snapshot) => {
            const newMessage = snapshot.val();
            if (newMessage) {
                // Mark messages from other users as read when received
                if (newMessage.user._id !== userId && !newMessage.read) {
                    // Update the message in Firebase to mark it as read
                    databaseRef(`/chats/${chatId}/${snapshot.key}`).update({
                        read: true,
                    });
                    // Update the message object to reflect read status
                    newMessage.read = true;
                }
                // Check if this message is already in our state to avoid duplicates
                // since we're also using the 'value' event
                setMessages(prevMessages => {
                    // Only add if not already in the messages array
                    if (!prevMessages.some(msg => msg._id === newMessage._id)) {
                        // Create a new array with the new message
                        const updatedMessages = [newMessage, ...prevMessages];
                        // No need for client-side sorting as we're using orderByChild on the server side
                        return updatedMessages;
                    }
                    return prevMessages;
                });
            }
        });
        // Simulate typing indicator
        // Stop listening for updates when no longer required
        return () => {
            //databaseRef(`/chats/${chatId}`).off('value', onValueChange);
            setMessages([]);
            databaseRef(`/chats/${chatId}`).off('child_added', onChildAdded);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        chatId,
        userId,
        userName,
        userAvatar,
        otherUserName,
        otherUserAvatar,
        orderId,
    ]);
    const sendAttachment = (0, react_1.useCallback)(async () => {
        var _a;
        if (!attachment)
            return;
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log({ attachment });
        }
        try {
            // Check if it's an audio attachment
            const isAudio = !!(((_a = attachment.type) === null || _a === void 0 ? void 0 : _a.startsWith('audio/')) ||
                (attachment.uri &&
                    attachment.uri.toLowerCase().match(/\.(mp3|m4a|wav|ogg|aac)$/)));
            // Store reference to the pending message
            const messageId = Math.random().toString();
            // Create message object based on attachment type
            let pendingMessage;
            let localAttachmentMessage;
            if (isAudio) {
                // For audio messages
                pendingMessage = {
                    _id: messageId,
                    text: '',
                    createdAt: new Date().getTime(),
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                    pending: true,
                    audio: attachment.uri,
                    isAudioMessage: true, // Flag to identify audio attachments
                };
                localAttachmentMessage = {
                    _id: messageId,
                    text: '',
                    createdAt: new Date().getTime(),
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                    audio: attachment.uri,
                    isAudioMessage: true,
                    read: false,
                };
            }
            else {
                // For image messages
                pendingMessage = {
                    _id: messageId,
                    text: '',
                    image: attachment.uri,
                    createdAt: new Date().getTime(),
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                    pending: true, // Mark as pending until upload completes
                };
                localAttachmentMessage = {
                    _id: messageId,
                    text: '',
                    image: attachment.uri,
                    createdAt: new Date().getTime(),
                    user: {
                        _id: userId,
                        name: userName,
                        avatar: userAvatar,
                    },
                    read: false, // Mark messages sent by the current user as read by default
                };
            }
            if (pendingMessageRef) {
                pendingMessageRef.current = pendingMessage;
            }
            // Send local attachment to Firebase
            const messageRef = await databaseRef(`/chats/${chatId}`).push(localAttachmentMessage);
            // Clear the attachment and preview immediately after sending
            const attachmentCopy = { ...attachment };
            setAttachment(null);
            setAttachmentPreview(null);
            // Upload the attachment in the background
            const response = await uploadAttachmentsMutation.mutateAsync({
                files: [attachmentCopy],
            });
            // Get the uploaded image URL from the response
            const imageUrl = response || attachmentCopy.uri;
            // Update the message with the uploaded URL
            if (imageUrl !== attachmentCopy.uri) {
                if (isAudio) {
                    // For audio messages, update the audio field
                    await databaseRef(`/chats/${chatId}/${messageRef.key}`).update({
                        audio: imageUrl,
                    });
                }
                else {
                    // For image messages, update the image field
                    await databaseRef(`/chats/${chatId}/${messageRef.key}`).update({
                        image: imageUrl,
                    });
                }
            }
        }
        catch (error) {
            // Handle error with Alert
            react_native_1.Alert.alert('Error', 'Failed to upload image. Please try again.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        attachment,
        chatId,
        userId,
        userName,
        userAvatar,
        uploadAttachmentsMutation,
    ]);
    const onSend = (0, react_1.useCallback)(async (newMessages = []) => {
        // If there's an attachment but no text message, send the attachment
        if (attachment && (!newMessages || newMessages.length === 0)) {
            await sendAttachment();
            return;
        }
        // Process new messages
        try {
            // Ensure the message has the correct user information
            const message = {
                ...newMessages[0],
                createdAt: new Date().getTime(),
                user: {
                    _id: userId,
                    name: userName,
                    avatar: userAvatar,
                },
                read: false, // Mark messages sent by the current user as read by default
            };
            // Send the message to Firebase
            await databaseRef(`/chats/${chatId}`).push(message);
            // Handle attachment if present
            if (attachment) {
                await sendAttachment();
            }
        }
        catch (error) {
            // Handle error (could show an alert or other UI feedback)
            react_native_1.Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    }, [
        attachment,
        chatId,
        databaseRef,
        userId,
        userName,
        userAvatar,
        sendAttachment,
    ]);
    // Custom header component
    const renderCustomHeader = () => {
        if (headerComponent) {
            return headerComponent;
        }
        // Use provided props or fall back to dynamic values extracted from messages
        const displayOtherUserName = otherUserName || dynamicOtherUserName;
        const displayOtherUserAvatar = otherUserAvatar || dynamicOtherUserAvatar;
        return (<react_native_1.View style={styles.headerContainer}>
        {/* <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Image source={require('../img/chevron-left.png')} />
            </TouchableOpacity> */}

        {displayOtherUserAvatar && (<react_native_1.View style={styles.headerProfile}>
            <react_native_1.Image source={{ uri: displayOtherUserAvatar }} style={styles.headerAvatar}/>
            <react_native_1.Text style={styles.headerName}>{displayOtherUserName}</react_native_1.Text>
          </react_native_1.View>)}

        <react_native_1.TouchableOpacity style={styles.callButton} onPress={onCallPress}>
          <react_native_1.Image source={require('../img/phone.png')}/>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    };
    // Cache for downloaded audio files
    const [audioCache, setAudioCache] = (0, react_1.useState)({});
    // Map to track which messages need audio download
    const [pendingAudioDownloads, setPendingAudioDownloads] = (0, react_1.useState)({});
    // Function to download and cache audio file
    const downloadAndCacheAudio = (0, react_1.useCallback)(async (url, messageId) => {
        try {
            // Check if already in cache
            if (audioCache[messageId]) {
                // Verify the file still exists - remove file:// prefix for RNFS.exists
                const cachePath = audioCache[messageId].replace('file://', '');
                const exists = await react_native_fs_1.default.exists(cachePath);
                if (exists) {
                    if (__DEV__) {
                        // eslint-disable-next-line no-console
                        console.log(`Using cached file: ${audioCache[messageId]}`);
                    }
                    return audioCache[messageId];
                }
                // If file doesn't exist, remove from cache and continue to download
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.log(`Cached file not found, downloading again: ${url}`);
                }
            }
            // Ensure URL has a protocol
            let validUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                // Add https protocol if missing
                validUrl = `https://${url}`;
                // If URL starts with // (protocol-relative URL), add https:
                if (url.startsWith('//')) {
                    validUrl = `https:${url}`;
                }
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.log(`Added protocol to URL: ${url} -> ${validUrl}`);
                }
            }
            // Create a unique filename for the cached audio
            const ext = url.split('.').pop() || 'mp3';
            const filename = `${messageId}.${ext}`;
            // Get the directory for caching
            const path = `${react_native_fs_1.default.CachesDirectoryPath}/${filename}`;
            // Check if file already exists
            const exists = await react_native_fs_1.default.exists(path);
            if (exists) {
                // Update cache and return path without file:// prefix
                setAudioCache(prev => ({ ...prev, [messageId]: path }));
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.log(`File already exists: ${path}`);
                }
                return path;
            }
            // Download the file using our downloadFile function
            try {
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.log(`Downloading file from: ${validUrl} to ${path}`);
                }
                const downloadTask = react_native_fs_1.default.downloadFile({
                    fromUrl: validUrl,
                    toFile: path,
                });
                // Wait for download to complete
                const result = await downloadTask.promise;
                if (result.statusCode !== 200) {
                    throw new Error(`Download failed with status code: ${result.statusCode}`);
                }
                // Verify the file exists after download
                const fileExists = await react_native_fs_1.default.exists(path);
                if (!fileExists) {
                    throw new Error('File not found after download');
                }
                // Get file size to verify it's not empty
                const fileStats = await react_native_fs_1.default.stat(path);
                if (fileStats.size === 0) {
                    throw new Error('Downloaded file is empty');
                }
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.log(`File downloaded successfully: ${path}, size: ${fileStats.size} bytes`);
                }
                // Update cache without file:// prefix
                setAudioCache(prev => ({ ...prev, [messageId]: path }));
                // Try to read a small part of the file to verify it's accessible
                try {
                    await react_native_fs_1.default.read(path, 10, 0, 'base64');
                    if (__DEV__) {
                        // eslint-disable-next-line no-console
                        console.log(`Successfully read from file: ${path}`);
                    }
                }
                catch (readError) {
                    if (__DEV__) {
                        // eslint-disable-next-line no-console
                        console.log(`Error reading from file: ${readError}`);
                    }
                }
                return path;
            }
            catch (downloadError) {
                // If download fails with the modified URL, try with the original URL
                if (validUrl !== url) {
                    if (__DEV__) {
                        // eslint-disable-next-line no-console
                        console.log(`Retrying download with original URL: ${url}`);
                    }
                    try {
                        const downloadTask = react_native_fs_1.default.downloadFile({
                            fromUrl: url,
                            toFile: path,
                        });
                        // Wait for download to complete
                        const result = await downloadTask.promise;
                        if (result.statusCode !== 200) {
                            throw new Error(`Download failed with status code: ${result.statusCode}`);
                        }
                        // Verify the file exists after download
                        const fileExists = await react_native_fs_1.default.exists(path);
                        if (!fileExists) {
                            throw new Error('File not found after download');
                        }
                        // Get file size to verify it's not empty
                        const fileStats = await react_native_fs_1.default.stat(path);
                        if (fileStats.size === 0) {
                            throw new Error('Downloaded file is empty');
                        }
                        if (__DEV__) {
                            // eslint-disable-next-line no-console
                            console.log(`File downloaded successfully with original URL: ${path}, size: ${fileStats.size} bytes`);
                        }
                        // Update cache without file:// prefix
                        setAudioCache(prev => ({ ...prev, [messageId]: path }));
                        return path;
                    }
                    catch (originalUrlError) {
                        if (__DEV__) {
                            // eslint-disable-next-line no-console
                            console.log(`Download failed with original URL: ${originalUrlError}`);
                        }
                        throw originalUrlError;
                    }
                }
                throw downloadError;
            }
        }
        catch (error) {
            // Handle error properly without console.error
            if (__DEV__) {
                // Only log in development
                react_native_1.Alert.alert('Debug: Audio Download Error', String(error));
            }
            // Return original URL if download fails
            return url;
        }
    }, [audioCache]);
    // Effect to handle audio downloads for messages
    (0, react_1.useEffect)(() => {
        // Process any pending audio downloads
        Object.entries(pendingAudioDownloads).forEach(([messageId, url]) => {
            // Skip if already in cache
            if (audioCache[messageId]) {
                return;
            }
            downloadAndCacheAudio(url, messageId)
                .then(_cachedPath => {
                // Remove from pending downloads once processed
                setPendingAudioDownloads(prev => {
                    const newPending = { ...prev };
                    delete newPending[messageId];
                    return newPending;
                });
            })
                .catch(() => {
                // Remove from pending even if failed
                setPendingAudioDownloads(prev => {
                    const newPending = { ...prev };
                    delete newPending[messageId];
                    return newPending;
                });
            });
        });
    }, [pendingAudioDownloads, audioCache, downloadAndCacheAudio]);
    if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log({ audioCache });
    }
    // Function to check if a path is a URL or local file
    const isRemoteUrl = (0, react_1.useCallback)((path) => {
        // Check if the path is a URL (starts with http://, https://, //, or doesn't start with /)
        return (path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('//') ||
            (!path.startsWith('/') && !path.startsWith('file://')));
    }, []);
    // Custom message component for system messages
    const renderCustomMessage = (props) => {
        const { currentMessage } = props;
        if (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.system) {
            return (<react_native_1.View style={styles.systemMessageContainer}>
          <react_native_1.View style={styles.systemMessageContent}>
            <react_native_1.Text style={styles.systemMessageText}>{currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.text}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>);
        }
        const isCurrentUser = (currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user._id) === userId;
        const bubbleStyle = isCurrentUser ? styles.bubbleRight : styles.bubbleLeft;
        const textStyle = isCurrentUser
            ? styles.bubbleTextRight
            : styles.bubbleTextLeft;
        // Check if it's an audio message
        const isAudioMessage = currentMessage.audio || currentMessage.isAudioMessage;
        // For audio messages, create a component with its own state and ref
        if (isAudioMessage) {
            return (<AudioMessageItem_1.AudioMessageItem currentMessage={currentMessage} isCurrentUser={isCurrentUser} bubbleStyle={bubbleStyle} textStyle={textStyle} userId={userId}/>);
        }
        return (<react_native_1.View style={[
                [styles.messageContainer],
                isCurrentUser ? styles.messageRight : styles.messageLeft,
            ]}>
        {!isCurrentUser && (<react_native_1.Image source={{ uri: currentMessage.user.avatar }} style={styles.messageAvatar}/>)}

        <react_native_1.View style={[styles.messageBubble, bubbleStyle]}>
          {/* Show image if present and not an audio message */}
          {currentMessage.image && (<react_native_1.Image source={{ uri: currentMessage.image }} style={styles.messageImage} resizeMode="cover"/>)}

          {/* Show text if present */}
          {currentMessage.text ? (<react_native_1.Text style={[
                    textStyle,
                    {
                        marginTop: currentMessage.image ? 8 : 0,
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
            {isCurrentUser && (<react_native_1.Image source={img_1.readIcon} style={[
                    styles.readStatusIcon,
                    {
                        tintColor: currentMessage.read
                            && '#2D65E4'
                    },
                ]}/>)}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>);
    };
    const renderInputToolbar = (props) => {
        // When recording, show a completely different input toolbar with just the waveform
        if (isRecording) {
            return (<react_native_1.View style={styles.recordingInputToolbar}>
          <react_native_1.View style={styles.waveformContainer}>
            <react_native_audio_waveform_1.Waveform ref={liveWaveformRef} mode="live" waveColor="#2D65E4" candleSpace={1} candleWidth={2.5} candleHeightScale={10}/>
          </react_native_1.View>
          <react_native_1.TouchableOpacity style={styles.recordingStopButton} onPress={async () => {
                    // Stop recording when the stop button is pressed
                    setIsRecording(false);
                    if (liveWaveformRef.current) {
                        try {
                            const filePath = await liveWaveformRef.current.stopRecord();
                            // Log file path in development only
                            if (__DEV__) {
                                // eslint-disable-next-line no-console
                                console.log({ filePath });
                            }
                            // Create a File object from the recording
                            // Get the actual file extension from the path
                            const fileExt = filePath.split('.').pop() ||
                                (react_native_1.Platform.OS === 'ios' ? 'm4a' : 'mp3');
                            // Create a File object with the correct extension
                            const audioFile = {
                                uri: filePath,
                                type: fileExt === 'm4a' ? 'audio/m4a' : 'audio/mpeg',
                                name: `recording_${new Date().getTime()}.${fileExt}`,
                            };
                            // Set attachment and preview
                            setAttachment(audioFile);
                            setAttachmentPreview(audioFile.uri);
                            // Log the file path for debugging in development only
                            if (__DEV__) {
                                // eslint-disable-next-line no-console
                                console.log('Audio file saved at:', filePath);
                            }
                        }
                        catch (error) {
                            // Handle error with Alert
                            react_native_1.Alert.alert('Error', 'Failed to stop recording');
                            if (__DEV__) {
                                // Only log in development and use eslint disable for this specific line
                                // eslint-disable-next-line no-console
                                console.log('Recording error:', error);
                            }
                        }
                    }
                }}>
            <react_native_1.Image source={require('../img/mic.png')} style={styles.recordingStopIcon} resizeMode="contain"/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>);
        }
        // Normal input toolbar when not recording
        return <react_native_gifted_chat_1.InputToolbar {...props} containerStyle={styles.inputToolbar}/>;
    };
    const renderComposer = (props) => (<react_native_gifted_chat_1.Composer {...props} textInputStyle={styles.composer} placeholder={placeholder}/>);
    const renderSend = (props) => {
        // Custom send button that handles both text and attachment
        const handleSend = () => {
            if (props.text && props.text.trim().length > 0) {
                // If there's text, use the default send handler
                props.onSend({ text: props.text.trim() }, true);
            }
            else if (attachment) {
                // If there's no text but there's an attachment, send the attachment
                sendAttachment();
            }
        };
        // Check if there's text or attachment
        const hasContent = props.text || attachment;
        // Check recording state
        if (!hasContent) {
            // When there's no content, show camera and mic buttons instead of send button
            return (<react_native_1.View style={styles.sendContainer}>
          {showCamera && (<react_native_1.TouchableOpacity style={styles.actionButtonRight} onPress={handleCameraLaunch}>
              <react_native_1.Image source={require('../img/camera.png')} resizeMode="contain" style={styles.actionIcon}/>
            </react_native_1.TouchableOpacity>)}
          <react_native_1.TouchableOpacity style={styles.micButton} onPress={async () => {
                    // Only start recording, stopping is handled by the waveform container
                    if (!isRecording) {
                        try {
                            // First request microphone permission using the hook's function
                            await startRecording();
                            // If permission is granted and recording starts successfully
                            setIsRecording(true);
                            if (hiddenWaveformRef.current) {
                                try {
                                    await hiddenWaveformRef.current.startRecord();
                                }
                                catch (error) {
                                    setIsRecording(false);
                                    react_native_1.Alert.alert('Error', 'Failed to start recording');
                                }
                            }
                        }
                        catch (error) {
                            // If permission is denied or there's another error
                            react_native_1.Alert.alert('Permission Required', 'Microphone permission is needed to record audio messages.');
                        }
                    }
                }}>
            <react_native_1.View style={styles.micIconContainer}>
              <react_native_1.Image source={require('../img/mic.png')} style={styles.actionIcon}/>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>

          {/* Hidden waveform for recording - always present but not visible */}
          {/* <View
                  style={{
                    width: 0,
                    height: 0,
                    overflow: 'hidden',
                    position: 'absolute',
                  }}>
                  <Waveform
                    ref={hiddenWaveformRef}
                    mode="live"
                    waveColor="#5366"
                    candleSpace={2}
                    candleWidth={4}
                  />
                </View> */}

          {/* Recording waveform overlay - only shown when recording */}
          {isRecording && (<react_native_1.View style={styles.recordingOverlay}>
              <react_native_1.View style={styles.waveformOverlayContainer}>
                <react_native_audio_waveform_1.Waveform ref={liveWaveformRef} mode="live" waveColor="#2D65E4" candleSpace={2} candleWidth={4}/>
              </react_native_1.View>
            </react_native_1.View>)}
        </react_native_1.View>);
        }
        // When there's content, show the send button
        return (<react_native_1.TouchableOpacity style={styles.sendContainer} onPress={handleSend} disabled={!props.text && !attachment}>
        <react_native_1.View style={styles.sendButton}>
          <react_native_1.Image source={require('../img/send.png')}/>
        </react_native_1.View>
      </react_native_1.TouchableOpacity>);
    };
    // Custom component to render the attachment preview
    const renderAccessory = () => {
        var _a;
        if (attachment) {
            // Check if it's an audio attachment
            const isAudio = (_a = attachment.type) === null || _a === void 0 ? void 0 : _a.startsWith('audio/');
            if (isAudio) {
                // Render audio player UI with AudioAccessoryItem component
                return (<AudioAccessoryItem_1.AudioAccessoryItem attachment={attachment} onRemove={() => {
                        if (isPlayingAudio) {
                            if (waveformRef.current) {
                                waveformRef.current.stopPlayer();
                            }
                            stopPlaying();
                        }
                        setAttachment(null);
                        setAttachmentPreview(null);
                        resetAudio();
                    }}/>);
            }
            // For image attachments
            return (<react_native_1.View style={styles.attachmentPreviewContainer}>
          <react_native_1.Image source={{ uri: attachment === null || attachment === void 0 ? void 0 : attachment.uri }} style={styles.attachmentPreview}/>
          <react_native_1.TouchableOpacity style={styles.removeAttachmentButton} onPress={() => {
                    setAttachment(null);
                    setAttachmentPreview(null);
                }}>
            <react_native_1.Text style={styles.removeAttachmentButtonText}>×</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>);
        }
        return null;
    };
    const handleImagePickerResponse = (response) => {
        if (response.errorCode) {
            // Implement proper error handling with Alert
            react_native_1.Alert.alert('Error', response.errorMessage || 'Failed to select image', [
                { text: 'OK' },
            ]);
        }
        else if (response.assets && response.assets[0].uri) {
            // Create a File object from the image picker response
            const file = {
                uri: response.assets[0].uri,
            };
            setAttachment(file);
            setAttachmentPreview(file.uri);
        }
    };
    const handleGalleryLaunch = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo', includeBase64: true }, handleImagePickerResponse);
    };
    const handleCameraLaunch = () => {
        ImagePicker.launchCamera({ mediaType: 'photo', includeBase64: true }, handleImagePickerResponse);
    };
    /**
     * Renders the action icons for the chat input toolbar
     */
    const renderActionIcons = () => {
        return (<react_native_1.View style={styles.actionIconContainer}>
        {showGallery && (<react_native_1.TouchableOpacity onPress={handleGalleryLaunch}>
            <react_native_1.Image source={require('../img/add.png')} resizeMode="contain" style={styles.actionIcon}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>);
    };
    const renderActions = (props) => {
        if (!showGallery) {
            return null;
        }
        return (<react_native_gifted_chat_1.Actions {...props} containerStyle={styles.actionContainer} icon={() => renderActionIcons()}/>);
    };
    // Create a map to store waveform refs for each message
    const _messageWaveformRefs = (0, react_1.useRef)(new Map());
    // Track which audio messages are currently playing
    const [_playingAudioMessages, _setPlayingAudioMessages] = (0, react_1.useState)(new Set());
    const renderMessageImage = (props) => {
        const { currentMessage } = props;
        const imageUrl = currentMessage.image;
        if (imageUrl) {
            // Default image rendering
            return (<react_native_1.View style={styles.imageContainer}>
          <react_native_1.Image source={{ uri: imageUrl }} style={styles.image}/>
        </react_native_1.View>);
        }
    };
    const renderFooter = () => {
        if (isTyping) {
            return (<react_native_1.View style={styles.typingContainer}>
          <react_native_1.Image source={{ uri: otherUserAvatar }} style={styles.typingAvatar}/>
          <react_native_1.View style={styles.typingIndicator}>
            <react_native_1.Text style={styles.typingText}>...</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>);
        }
        return null;
    };
    /**
     * Example of how to use the standalone listenForNewMessages function:
     *
     * This demonstrates how you could use the standalone function in another component
     * or in a different context outside of this component.
     *
     * // Import the function
     * import { listenForNewMessages } from './Chat';
     *
     * // In your component:
     * useEffect(() => {
     *   // Set up the listener
     *   const unsubscribe = listenForNewMessages(
     *     databaseRef,
     *     'chat123',
     *     (newMessage) => {
     *       // Process the new message
     *       // Handle the new message (e.g., show notification, play sound)
     *     }
     *   );
     *
     *   // Clean up when component unmounts
     *   return unsubscribe;
     * }, []);
     */
    return (<react_native_1.SafeAreaView style={[styles.container, containerStyle]}>
      <react_native_1.StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"/>
      {renderCustomHeader()}
      <react_native_gifted_chat_1.GiftedChat messages={messages} onSend={(newMessages) => onSend(newMessages)} user={{
            _id: userId,
            name: userName,
            avatar: userAvatar,
        }} renderInputToolbar={renderInputToolbar} renderComposer={renderComposer} renderSend={renderSend} renderActions={renderActions} renderMessageImage={renderMessageImage} renderMessage={renderCustomMessage} renderFooter={renderFooter} renderAvatar={props => {
            const { currentMessage } = props;
            // Only show avatar for messages not from the current user
            if ((currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user._id) === userId) {
                return null;
            }
            return (<react_native_1.Image source={{ uri: currentMessage === null || currentMessage === void 0 ? void 0 : currentMessage.user.avatar }} style={styles.messageAvatar}/>);
        }} 
    // Don't override text, allowing user to type text along with attachment
    renderChatFooter={renderAccessory}/>
    </react_native_1.SafeAreaView>);
};
exports.Chat = Chat;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    audioPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    audioPlayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7941D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    audioPlayButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    audioInfoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    audioControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    audioFileName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
    },
    audioDuration: {
        fontSize: 12,
        color: '#666666',
    },
    audioProgressBar: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginTop: 5,
        width: '100%',
    },
    audioProgressFill: {
        height: 4,
        backgroundColor: '#4285F4',
        borderRadius: 2,
    },
    recordingButton: {
        backgroundColor: '#FF4136',
    },
    recordingIndicator: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(255, 65, 54, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    recordingTime: {
        color: 'white',
        fontSize: 10,
    },
    recordingContainer: {
        position: 'absolute',
        top: -50,
        right: -10,
        width: 200,
        backgroundColor: 'rgba(255, 65, 54, 0.8)',
        borderRadius: 10,
        padding: 5,
        zIndex: 1000,
    },
    recordingOverlay: {
        position: 'absolute',
        top: -100,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    waveformContainer: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 10,
        paddingHorizontal: 10,
    },
    waveformOverlayContainer: {
        width: '100%',
        height: 60,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    recordingInputToolbar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        paddingVertical: 12,
        paddingHorizontal: 15,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recordingMicContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingMicIcon: {
        width: 24,
        height: 24,
        tintColor: '#FF4136',
    },
    micButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    micIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    slideToCancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideToCancelText: {
        color: '#666',
        fontSize: 16,
        marginRight: 5,
    },
    slideToCancelIcon: {
        width: 16,
        height: 16,
        tintColor: '#666',
    },
    recordingStopButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingStopIcon: {
        width: 24,
        height: 24,
        tintColor: '#E2574C',
    },
    recordingWaveformContainer: {
        width: '100%',
        height: 30,
        marginTop: 5,
    },
    recorderContainer: {
        width: 100,
        height: 40,
        marginLeft: 5,
    },
    attachmentPreviewContainer: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    attachmentPreview: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
    removeAttachmentButton: {
        position: 'absolute',
        top: 5,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
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
        padding: 5,
    },
    backButtonText: {
        fontSize: 24,
        color: '#4285F4',
    },
    headerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    callButton: {
        padding: 5,
    },
    callButtonText: {
        fontSize: 24,
        color: '#4285F4',
    },
    inputToolbar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        paddingVertical: 12,
        paddingHorizontal: 0,
        height: 70,
    },
    composer: {
        backgroundColor: 'white',
        borderWidth: 0.3,
        borderColor: '#8E8E93',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontSize: 16,
        flex: 1,
        height: 10,
        minWidth: 150,
        marginHorizontal: 10,
        maxWidth: '80%', // Limit the maximum width
    },
    sendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 5,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonRight: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sendButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    actionContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 0,
        marginRight: 0,
        paddingRight: 0,
    },
    actionIconContainer: {
        flexDirection: 'row',
    },
    iconText: {
        fontSize: 20,
    },
    actionIcon: {
        marginHorizontal: 5,
    },
    imageContainer: {
        borderRadius: 13,
        padding: 2,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 13,
    },
    bubbleLeft: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderBottomLeftRadius: 5,
        marginLeft: 10,
        marginBottom: 5,
    },
    bubbleRight: {
        backgroundColor: '#4285F4',
        borderRadius: 18,
        borderBottomRightRadius: 5,
        marginRight: 10,
        marginBottom: 5,
    },
    bubbleTextLeft: {
        color: '#333333',
    },
    bubbleTextRight: {
        color: '#FFFFFF',
    },
    dayContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    dayText: {
        color: '#999999',
        fontSize: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    systemMessageContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    systemMessageContent: {
        backgroundColor: '#F8F8F8',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    systemMessageText: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center',
    },
    orderIdText: {
        color: '#4285F4',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginLeft: 10,
        marginBottom: 10,
    },
    typingAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    typingIndicator: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    typingText: {
        fontSize: 20,
        lineHeight: 20,
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
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    audioMessageContainer: {
        width: '100%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemContainer: {
        marginTop: 16,
        alignItems: 'flex-start',
    },
    listItemWidth: {
        width: '50%',
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        overflow: 'hidden',
        columnGap: 8,
        paddingHorizontal: 8,
        backgroundColor: '#2D65E4',
    },
    audioDownloadButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2D65E4',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    downloadIcon: {
        width: 16,
        height: 16,
        tintColor: '#FFFFFF',
    },
    textWaveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    textWaveform: {
        color: '#4285F4',
        fontSize: 14,
        letterSpacing: -2,
    },
    audioMessageTime: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 5,
    },
    staticWaveformView: {
        flex: 1,
        height: 30,
    },
    playBackControlPressable: {
        height: 30,
        width: 30,
        justifyContent: 'center',
    },
});
