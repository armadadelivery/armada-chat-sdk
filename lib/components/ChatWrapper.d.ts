import React from 'react';
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
export declare const ChatWrapper: React.FC<ChatWrapperProps>;
export {};
