import { withVideoCanvas } from './decorators/VideoCanvas';

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#fdfdfd', // --color-bg (light mode)
        },
        {
          name: 'dark',
          value: '#18181b', // --color-bg (dark mode)
        },
      ],
    },
  },
  decorators: [withVideoCanvas],
};

export default preview;