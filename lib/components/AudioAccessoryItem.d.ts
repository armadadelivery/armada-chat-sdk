import React from 'react';
export interface File {
    uri: string;
    type?: string;
    name?: string;
}
export interface AudioAccessoryItemProps {
    attachment: File;
    onRemove: () => void;
}
export declare const AudioAccessoryItem: React.MemoExoticComponent<({ attachment, onRemove }: AudioAccessoryItemProps) => React.JSX.Element>;
