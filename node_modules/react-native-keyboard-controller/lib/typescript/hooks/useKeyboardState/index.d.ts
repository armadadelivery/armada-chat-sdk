import type { KeyboardState } from "../../types";
/**
 * React Hook that represents the current keyboard state on iOS and Android.
 * It tracks keyboard visibility, height, appearance, type and other properties.
 * This hook subscribes to keyboard events and updates the state reactively.
 *
 * @returns Object {@link KeyboardState|containing} keyboard state information.
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-state|Documentation} page for more details.
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isVisible, height } = useKeyboardState();
 *   return (
 *     <View>
 *       <Text>Keyboard is {isVisible ? 'visible' : 'hidden'}</Text>
 *       <Text>Keyboard height: {height}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export declare const useKeyboardState: () => KeyboardState;
