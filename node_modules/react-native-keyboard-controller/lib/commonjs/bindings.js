"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowDimensionsEvents = exports.RCTOverKeyboardView = exports.KeyboardGestureArea = exports.KeyboardEvents = exports.KeyboardControllerView = exports.KeyboardControllerNative = exports.FocusedInputEvents = void 0;
var _reactNative = require("react-native");
const NOOP = () => {};
const KeyboardControllerNative = exports.KeyboardControllerNative = {
  setDefaultMode: NOOP,
  setInputMode: NOOP,
  dismiss: NOOP,
  setFocusTo: NOOP,
  addListener: NOOP,
  removeListeners: NOOP
};
/**
 * An event emitter that provides a way to subscribe to next keyboard events:
 * - `keyboardWillShow`;
 * - `keyboardDidShow`;
 * - `keyboardWillHide`;
 * - `keyboardDidHide`.
 *
 * Use `addListener` function to add your event listener for a specific keyboard event.
 */
const KeyboardEvents = exports.KeyboardEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
/**
 * This API is not documented, it's for internal usage only (for now), and is a subject to potential breaking changes in future.
 * Use it with cautious.
 */
const FocusedInputEvents = exports.FocusedInputEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
const WindowDimensionsEvents = exports.WindowDimensionsEvents = {
  addListener: () => ({
    remove: NOOP
  })
};
/**
 * A view that sends events whenever keyboard or focused events are happening.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller-view|Documentation} page for more details.
 */
const KeyboardControllerView = exports.KeyboardControllerView = _reactNative.View;
/**
 * A view that defines a region on the screen, where gestures will control the keyboard position.
 *
 * @see {@link https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-gesture-area|Documentation} page for more details.
 */
const KeyboardGestureArea = exports.KeyboardGestureArea = _reactNative.View;
const RCTOverKeyboardView = exports.RCTOverKeyboardView = _reactNative.View;
//# sourceMappingURL=bindings.js.map