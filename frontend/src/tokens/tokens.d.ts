/**
 * Pejla Design Tokens v2.0.0 - TypeScript Definitions
 * Auto-generated type definitions for design tokens
 */

export interface DesignTokens {
  version: string;
  colors: {
    primitive: {
      gray: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950' | '1000', string>;
      purple: Record<'400' | '500' | '600', string>;
      teal: Record<'50' | '500' | '900', string>; // v2
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
      // v2: Surface Container Tokens (M3-inspired)
      surface: {
        default: string;
        dim: string;
        bright: string;
        container: {
          lowest: string;
          low: string;
          default: string;
          high: string;
          highest: string;
        };
      };
      // v2: On-Surface Text Colors
      'on-surface': {
        default: string;
        variant: string;
        muted: string;
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
      // v2: Outline Variants
      outline: {
        default: string;
        variant: string;
      };
      brand: {
        primary: string;
        'primary-foreground': string;
        secondary: string;
        'secondary-foreground': string;
        // v2: Tertiary Brand Color
        tertiary: string;
        'tertiary-foreground': string;
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
      // v2: Dark Mode Surface Containers
      surface: {
        default: string;
        dim: string;
        bright: string;
        container: {
          lowest: string;
          low: string;
          default: string;
          high: string;
          highest: string;
        };
      };
      // v2: Dark Mode On-Surface
      'on-surface': {
        default: string;
        variant: string;
        muted: string;
      };
      // v2: Dark Mode Outlines
      outline: {
        default: string;
        variant: string;
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
        // v2: Dark Mode Tertiary
        tertiary: string;
        'tertiary-foreground': string;
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
    '2xs': string; // v2
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
  // v2: Drop Shadows
  dropShadow: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  animations: {
    duration: Record<'instant' | 'short-1' | 'fast' | 'base' | 'medium-1' | 'moderate' | 'long-1' | 'slow' | 'slower', number>; // v2: added short-1, medium-1, long-1
    easing: Record<'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'emphasized' | 'emphasized-decelerate' | 'emphasized-accelerate' | 'bounce', string>; // v2: M3 easing
    scale: Record<'active' | 'hover', number>;
  };
  blur: Record<'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl', number>;
  opacity: Record<string, number> & {
    // v2: State Layer Opacity
    state: {
      hover: number;
      focus: number;
      press: number;
      drag: number;
      disabled: number;
    };
  };
  // v2: Aspect Ratios
  aspectRatio: Record<'square' | 'video' | 'portrait' | 'landscape' | 'ultrawide', string>;
  zIndex: Record<string, number>;
}

// CSS Custom Property Types
export type ColorToken =
  | `--color-gray-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 1000}`
  | `--color-purple-${400 | 500 | 600}`
  | `--color-teal-${50 | 500 | 900}` // v2
  | `--color-red-${500 | 600}`
  | '--color-white'
  | '--color-black'
  | '--color-background'
  | '--color-background-subtle'
  | '--color-background-card'
  | '--color-background-input'
  // v2: Surface Container Tokens
  | '--color-surface'
  | '--color-surface-dim'
  | '--color-surface-bright'
  | '--color-surface-container-lowest'
  | '--color-surface-container-low'
  | '--color-surface-container'
  | '--color-surface-container-high'
  | '--color-surface-container-highest'
  // v2: On-Surface Text
  | '--color-on-surface'
  | '--color-on-surface-variant'
  | '--color-on-surface-muted'
  | '--color-foreground'
  | '--color-text-primary'
  | '--color-text-secondary'
  | '--color-text-muted'
  | '--color-border'
  // v2: Outline Variants
  | '--color-outline'
  | '--color-outline-variant'
  | '--color-brand-primary'
  | '--color-brand-primary-foreground'
  | '--color-brand-secondary'
  | '--color-brand-secondary-foreground'
  // v2: Tertiary Brand
  | '--color-brand-tertiary'
  | '--color-brand-tertiary-foreground'
  | '--color-accent'
  | '--color-destructive';

export type SpacingToken =
  | '--spacing-0'
  | '--spacing-0-5'
  | '--spacing-1'
  | '--spacing-1-5'
  | '--spacing-2'
  | '--spacing-2-5'
  | '--spacing-3'
  | '--spacing-3-5' // v2
  | '--spacing-4'
  | '--spacing-5'
  | '--spacing-6'
  | '--spacing-7'
  | '--spacing-8'
  | '--spacing-9'
  | '--spacing-10'
  | '--spacing-11'
  | '--spacing-12'
  | '--spacing-14'
  | '--spacing-16'
  | '--spacing-20'
  | '--spacing-24'
  | '--spacing-28'
  | '--spacing-32'
  | '--spacing-48'
  | '--spacing-64';

export type TypographyToken =
  | '--font-sans'
  | '--font-display'
  | '--font-mono'
  | `--text-${'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'}`
  | `--font-${'light' | 'normal' | 'medium' | 'semibold' | 'bold'}`
  | `--leading-${'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'}`
  | `--tracking-${'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'}`;

export type RadiusToken =
  | '--radius-none'
  | '--radius-sm'
  | '--radius-md'
  | '--radius-lg'
  | '--radius-xl'
  | '--radius-2xl'
  | '--radius-3xl'
  | '--radius-full';

export type ShadowToken =
  | '--shadow-2xs' // v2
  | '--shadow-xs'
  | '--shadow-sm'
  | '--shadow-base'
  | '--shadow-md'
  | '--shadow-lg'
  | '--shadow-xl'
  | '--shadow-2xl'
  | '--shadow-button-default'
  | '--shadow-button-hover'
  | '--shadow-button-secondary'
  // v2: Drop Shadows
  | '--drop-shadow-xs'
  | '--drop-shadow-sm'
  | '--drop-shadow-md'
  | '--drop-shadow-lg'
  | '--drop-shadow-xl'
  | '--drop-shadow-2xl';

export type AnimationToken =
  | '--duration-instant'
  | '--duration-short-1' // v2
  | '--duration-fast'
  | '--duration-base'
  | '--duration-medium-1' // v2
  | '--duration-moderate'
  | '--duration-long-1' // v2
  | '--duration-slow'
  | '--duration-slower'
  | `--ease-${'linear' | 'in' | 'out' | 'in-out' | 'spring'}`
  // v2: M3 Easing
  | '--ease-emphasized'
  | '--ease-emphasized-decelerate'
  | '--ease-emphasized-accelerate'
  | '--ease-bounce'
  | '--scale-active'
  | '--scale-hover';

// v2: State Layer Tokens
export type StateLayerToken =
  | '--opacity-hover'
  | '--opacity-focus'
  | '--opacity-press'
  | '--opacity-drag'
  | '--opacity-disabled'
  | '--state-hover'
  | '--state-focus'
  | '--state-press';

// v2: Aspect Ratio Tokens
export type AspectRatioToken =
  | '--aspect-square'
  | '--aspect-video'
  | '--aspect-portrait'
  | '--aspect-landscape'
  | '--aspect-ultrawide';

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
  | StateLayerToken // v2
  | AspectRatioToken // v2
  | ZIndexToken;

// Utility function to get CSS variable value
export function getTokenValue(token: DesignToken): string {
  return `var(${token})`;
}

// Utility type for style objects
export type TokenStyles = {
  [K in keyof React.CSSProperties]?: React.CSSProperties[K] | `var(${DesignToken})`;
};

// v2: Token count metadata
export const TOKEN_METADATA = {
  version: '2.0.0',
  totalTokens: 247,
  newInV2: 47,
  categories: {
    colors: 95,
    spacing: 39,
    typography: 40,
    shadows: 20,
    animations: 17,
    opacity: 18,
    aspectRatio: 5,
    radii: 9,
    zIndex: 13,
  },
} as const;
