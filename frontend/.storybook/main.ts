import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        host: '0.0.0.0',
        strictPort: true,
        cors: true,
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          'lucide-react',
          'next-themes',
          'sonner',
          'class-variance-authority',
          '@radix-ui/react-slot',
          'clsx',
          'tailwind-merge',
          'react-router-dom',
          'react-markdown',
        ],
      },
    };
  },
};
export default config;