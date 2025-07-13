declare module 'react-native-emoji-selector' {
  import { Component } from 'react';

  interface EmojiSelectorProps {
    onEmojiSelected: (emoji: string) => void;
    theme?: string;
    showSearchBar?: boolean;
    showTabs?: boolean;
    showHistory?: boolean;
    showSectionTitles?: boolean;
    category?: any;
    columns?: number;
    placeholder?: string;
  }

  export default class EmojiSelector extends Component<EmojiSelectorProps> {}
}
