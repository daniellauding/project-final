/**
 * Pejla Design Tokens - TypeScript Definitions
 * Auto-generated type definitions for design tokens
 */

export interface DesignTokens {
  colors: {
    primitive: {
      gray: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950' | '1000', string>;
      purple: Record<'400' | '500' | '600', string>;
      red: Record<'500' | '600', string>;
      orange: Record<'500', string>;
      yellow: Record<'500', string>;
      green: Record<'500' | '600', string>;
      blue: Record<'500', string>;
      pink: Record<'500' | '600' | '700', string>;
      white: string;
      black: string;
    };
    semantic: {
      background: {
        default: string;
        subtle: string;
        card: string;
        popover: string;
        input: string;
        sidebar: string;
      };
      foreground: {
        default: string;
        card: string;
        popover: string;
        sidebar: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
        disabled: string;
      };
      border: {
        default: string;
        input: string;
        sidebar: string;
      };
      brand: {
        primary: string;
        'primary-foreground': string;
        secondary: string;
        'secondary-foreground': string;
      };
      accent: {
        default: string;
        foreground: string;
        sidebar: string;
        'sidebar-foreground': string;
      };
      muted: {
        default: string;
        foreground: string;
      };
      destructive: {
        default: string;
        foreground: string;
      };
      ring: {
        default: string;
        sidebar: string;
      };
      chart: Record<'1' | '2' | '3' | '4' | '5', string>;
      sidebar: {
        primary: string;
        'primary-foreground': string;
      };
    };
    dark: {
      background: {
        default: string;
        card: string;
        popover: string;
        input: string;
        sidebar: string;
      };
      foreground: {
        default: string;
        card: string;
        popover: string;
        sidebar: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      border: {
        default: string;
        input: string;
        sidebar: string;
      };
      brand: {
        primary: string;
        'primary-foreground': string;
        secondary: string;
        'secondary-foreground': string;
      };
      accent: {
        default: string;
        foreground: string;
        sidebar: string;
        'sidebar-foreground': string;
      };
      muted: {
        default: string;
        foreground: string;
      };
      destructive: {
        default: string;
        foreground: string;
      };
      ring: {
        default: string;
        sidebar: string;
      };
      chart: Record<'1' | '2' | '3' | '4' | '5', string>;
      sidebar: {
        primary: string;
        'primary-foreground': string;
      };
    };
  };
  spacing: {
    base: number;
    scale: Record<string, number>;
  };
  typography: {
    fontFamilies: {
      sans: string;
      display: string;
      mono: string;
    };
    fontSizes: Record<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl', number>;
    fontWeights: Record<'light' | 'normal' | 'medium' | 'semibold' | 'bold', number>;
    lineHeights: Record<'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose', number>;
    letterSpacing: Record<'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest', string>;
  };
  radii: Record<'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full', number>;
  shadows: {
    none: string;
    xs: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    button: {
      default: string;
      hover: string;
      secondary: string;
      'secondary-hover': string;
      destructive: string;
      outline: string;
      'outline-hover': string;
    };
  };
  animations: {
    duration: Record<'instant' | 'fast' | 'base' | 'moderate' | 'slow' | 'slower', number>;
    easing: Record<'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring', string>;
    scale: Record<'active' | 'hover', number>;
  };
  blur: Record<'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', number>;
  opacity: Record<string, number>;
  zIndex: Record<string, number>;
}

// CSS Custom Property Types
export type ColorToken =
  | `--color-gray-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000}`
  | `--color-purple-${400 | 500 | 600}`
  | `--color-red-${500 | 600}`
  | '--color-white'
  | '--color-black'
  | '--color-background'
  | '--color-background-subtle'
  | '--color-background-card'
  | '--color-background-input'
  | '--color-foreground'
  | '--color-text-primary'
  | '--color-text-secondary'
  | '--color-text-muted'
  | '--color-border'
  | '--color-brand-primary'
  | '--color-brand-primary-foreground'
  | '--color-accent'
  | '--color-destructive';

export type SpacingToken =
  | '--spacing-0'
  | '--spacing-1'
  | '--spacing-2'
  | '--spacing-3'
  | '--spacing-4'
  | '--spacing-6'
  | '--spacing-8'
  | '--spacing-12'
  | '--spacing-16'
  | '--spacing-20'
  | '--spacing-24'
  | '--spacing-32'
  | '--spacing-48'
  | '--spacing-64';

export type TypographyToken =
  | '--font-sans'
  | '--font-display'
  | '--font-mono'
  | `--text-${'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'}`
  | `--font-${'light' | 'normal' | 'medium' | 'semibold' | 'bold'}`
  | `--leading-${'tight' | 'normal' | 'relaxed'}`
  | `--tracking-${'tighter' | 'tight' | 'normal' | 'wide'}`;

export type RadiusToken =
  | '--radius-none'
  | '--radius-sm'
  | '--radius-md'
  | '--radius-lg'
  | '--radius-xl'
  | '--radius-full';

export type ShadowToken =
  | '--shadow-sm'
  | '--shadow-base'
  | '--shadow-md'
  | '--shadow-lg'
  | '--shadow-xl'
  | '--shadow-button-default'
  | '--shadow-button-hover'
  | '--shadow-button-secondary';

export type AnimationToken =
  | `--duration-${'fast' | 'base' | 'moderate' | 'slow'}`
  | `--ease-${'linear' | 'in' | 'out' | 'in-out' | 'spring'}`
  | '--scale-active'
  | '--scale-hover';

export type ZIndexToken =
  | '--z-dropdown'
  | '--z-modal'
  | '--z-popover'
  | '--z-tooltip';

export type DesignToken =
  | ColorToken
  | SpacingToken
  | TypographyToken
  | RadiusToken
  | ShadowToken
  | AnimationToken
  | ZIndexToken;

// Utility function to get CSS variable value
export function getTokenValue(token: DesignToken): string {
  return `var(${token})`;
}

// Utility type for style objects
export type TokenStyles = {
  [K in keyof React.CSSProperties]?: React.CSSProperties[K] | `var(${DesignToken})`;
};
