import React from 'react';
export interface AudioMessageItemProps {
    currentMessage: any;
    isCurrentUser: boolean;
    bubbleStyle: any;
    textStyle: any;
    userId: string;
    audioCache?: {
        [key: string]: string;
    };
    isRemoteUrl?: (path: string) => boolean;
    ensureFileProtocol?: (path: string) => string;
    onAudioDownloaded?: (messageId: string, localPath: string) => void;
}
export declare const AudioMessageItem: React.MemoExoticComponent<({ currentMessage, isCurrentUser, bubbleStyle, textStyle, userId: _userId, isRemoteUrl, ensureFileProtocol, onAudioDownloaded, }: AudioMessageItemProps) => React.JSX.Element>;
