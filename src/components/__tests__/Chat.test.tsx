import {render} from '@testing-library/react-native';
import React from 'react';

import {Chat} from '../Chat';

// Mock the dependencies
jest.mock('react-native-gifted-chat', () => ({
  GiftedChat: jest.fn().mockImplementation(_props => {
    return null;
  }),
  Actions: jest.fn().mockImplementation(_props => {
    return null;
  }),
  Composer: jest.fn().mockImplementation(_props => {
    return null;
  }),
  InputToolbar: jest.fn().mockImplementation(_props => {
    return null;
  }),
  Send: jest.fn().mockImplementation(_props => {
    return null;
  }),
}));

jest.mock('react-native-emoji-selector', () => {
  return jest.fn().mockImplementation(_props => {
    return null;
  });
});

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

describe('Chat Component', () => {
  // Mock firebase
  jest.mock('@react-native-firebase/database', () => ({
    firebase: {
      app: () => ({
        database: () => ({
          ref: jest.fn().mockImplementation(_path => ({
            on: jest.fn().mockReturnThis(),
            off: jest.fn(),
            push: jest.fn().mockResolvedValue(undefined),
            orderByChild: jest.fn().mockReturnThis(),
          })),
        }),
      }),
    },
  }));

  const defaultProps = {
    chatId: 'test-chat',
    userId: 'test-user',
  };

  it('renders correctly with default props', () => {
    const {toJSON} = render(<Chat {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with custom header', () => {
    const CustomHeader = () => <></>;
    const {toJSON} = render(
      <Chat {...defaultProps} headerComponent={<CustomHeader />} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with custom placeholder', () => {
    const {toJSON} = render(
      <Chat {...defaultProps} placeholder="Custom placeholder" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });


  it('renders correctly with camera disabled', () => {
    const {toJSON} = render(<Chat {...defaultProps} showCamera={false} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with gallery disabled', () => {
    const {toJSON} = render(<Chat {...defaultProps} showGallery={false} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
