declare module 'react-native-gifted-chat' {
  import {ReactNode} from 'react';
  import {StyleProp, ViewStyle} from 'react-native';

  export interface User {
    _id: string | number;
    name?: string;
    avatar?: string;
  }

  export interface IMessage {
    _id: string | number;
    text: string;
    createdAt: Date | number;
    user: User;
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
    quickReplies?: {
      type: 'radio' | 'checkbox';
      values: Array<{
        title: string;
        value: string;
        messageId?: string;
      }>;
      keepIt?: boolean;
    };
  }

  export interface GiftedChatProps {
    messages?: IMessage[];
    text?: string;
    placeholder?: string;
    user?: User;
    onSend?: (messages: IMessage[]) => void;
    alwaysShowSend?: boolean;
    scrollToBottom?: boolean;
    renderAvatar?: (props: any) => ReactNode;
    renderBubble?: (props: any) => ReactNode;
    renderFooter?: (props: any) => ReactNode;
    renderMessageText?: (props: any) => ReactNode;
    renderMessageImage?: (props: any) => ReactNode;
    renderComposer?: (props: any) => ReactNode;
    renderCustomView?: (props: any) => ReactNode;
    renderDay?: (props: any) => ReactNode;
    renderInputToolbar?: (props: any) => ReactNode;
    renderLoadEarlier?: (props: any) => ReactNode;
    renderLoading?: (props: any) => ReactNode;
    renderMessage?: (props: any) => ReactNode;
    renderSend?: (props: any) => ReactNode;
    renderTime?: (props: any) => ReactNode;
    renderActions?: (props: any) => ReactNode;
    isCustomViewBottom?: boolean;
    maxInputLength?: number;
    parsePatterns?: (linkStyle: any) => any;
    onPressAvatar?: (user: User) => void;
    onLongPressAvatar?: (user: User) => void;
    onPressActionButton?: () => void;
    bottomOffset?: number;
    minInputToolbarHeight?: number;
    listViewProps?: any;
    keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
    onInputTextChanged?: (text: string) => void;
    loadEarlier?: boolean;
    isLoadingEarlier?: boolean;
    showUserAvatar?: boolean;
    showAvatarForEveryMessage?: boolean;
    onLoadEarlier?: () => void;
    isTyping?: boolean;
    renderChatEmpty?: () => ReactNode;
    renderChatFooter?: () => ReactNode;
    renderSystemMessage?: (props: any) => ReactNode;
    onQuickReply?: (replies: any[]) => void;
    infiniteScroll?: boolean;
    extraData?: any;
    scrollToBottomStyle?: StyleProp<ViewStyle>;
    alignTop?: boolean;
    inverted?: boolean;
    scrollToBottomOffset?: number;
    messagesContainerStyle?: StyleProp<ViewStyle>;
    parsePatterns?: (linkStyle: any) => any;
  }

  export class GiftedChat extends React.Component<GiftedChatProps> {
    static append(
      currentMessages: IMessage[] | undefined,
      messages: IMessage[],
      inverted?: boolean,
    ): IMessage[];
  }

  export class Actions extends React.Component<any> {}
  export class Composer extends React.Component<any> {}
  export class InputToolbar extends React.Component<any> {}
  export class Send extends React.Component<any> {}
}
