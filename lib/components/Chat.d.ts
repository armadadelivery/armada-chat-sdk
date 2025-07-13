import React from 'react';
import { IMessage as GiftedChatIMessage } from 'react-native-gifted-chat';
interface IMessage extends GiftedChatIMessage {
    isAudioMessage?: boolean;
    read?: boolean;
}
interface ChatProps {
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
     * Custom header component (optional)
     */
    headerComponent?: React.ReactNode;
    /**
     * Custom styles for the chat container (optional)
     */
    containerStyle?: object;
    /**
     * Custom placeholder for the text input (optional)
     */
    placeholder?: string;
    /**
     * Whether to show the camera button (optional, default: true)
     */
    showCamera?: boolean;
    /**
     * Whether to show the gallery button (optional, default: true)
     */
    showGallery?: boolean;
    /**
     * Callback for when the back button is pressed (optional)
     */
    onBackPress?: () => void;
    /**
     * Callback for when the call button is pressed (optional)
     */
    onCallPress?: () => void;
    /**
     * Order ID for the chat (optional)
     */
    orderId?: string;
}
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
export declare const listenForNewMessages: (chatId: string, callback: (message: IMessage) => void) => () => void;
export declare const Chat: React.FC<ChatProps>;
export {};
