import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/ThemeProvider'
import { Toaster } from '../src/components/ui/sonner'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
    },
  },

  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
        <Toaster />
      </ThemeProvider>
    ),
  ],
};

export default preview;