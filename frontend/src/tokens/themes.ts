/**
 * Theme Presets
 * Predefined theme configurations for light/dark modes and custom brands
 */

export type ThemeOverrides = Record<string, string>;

/**
 * Light theme (default)
 */
export const lightTheme: ThemeOverrides = {
  '--color-background': 'oklch(0.95 0.005 90)',
  '--color-foreground': 'oklch(0.12 0 0)',
  '--color-background-card': 'oklch(0.97 0.004 90)',
  '--color-background-input': 'oklch(0.88 0.008 90)',
  '--color-border': 'oklch(0.88 0.008 90)',
  '--color-brand-primary': 'oklch(0.72 0.11 270)',
  '--color-brand-primary-foreground': 'oklch(1 0 0)',
};

/**
 * Dark theme
 */
export const darkTheme: ThemeOverrides = {
  '--color-background': 'oklch(0.10 0.005 90)',
  '--color-foreground': 'oklch(0.92 0.005 90)',
  '--color-background-card': 'oklch(0.14 0.005 90)',
  '--color-background-input': 'oklch(1 0.005 90 / 15%)',
  '--color-border': 'oklch(1 0.005 90 / 10%)',
  '--color-brand-primary': 'oklch(0.76 0.12 270)',
  '--color-brand-primary-foreground': 'oklch(0.10 0.005 90)',
};

/**
 * Purple brand theme
 * For Teams/Organizations that want purple branding
 */
export const purpleTheme: ThemeOverrides = {
  '--color-brand-primary': 'oklch(0.72 0.11 270)',
  '--color-brand-primary-foreground': 'oklch(1 0 0)',
  '--color-brand-secondary': 'oklch(0.76 0.12 270)',
};

/**
 * Green brand theme
 * For Teams/Organizations that want green branding
 */
export const greenTheme: ThemeOverrides = {
  '--color-brand-primary': 'oklch(0.696 0.17 162.48)',
  '--color-brand-primary-foreground': 'oklch(1 0 0)',
  '--color-brand-secondary': 'oklch(0.6 0.118 184.704)',
};

/**
 * Blue brand theme
 * For Teams/Organizations that want blue branding
 */
export const blueTheme: ThemeOverrides = {
  '--color-brand-primary': 'oklch(0.398 0.07 227.392)',
  '--color-brand-primary-foreground': 'oklch(1 0 0)',
  '--color-brand-secondary': 'oklch(0.488 0.243 264.376)',
};

/**
 * Orange brand theme
 * For Teams/Organizations that want orange branding
 */
export const orangeTheme: ThemeOverrides = {
  '--color-brand-primary': 'oklch(0.646 0.222 41.116)',
  '--color-brand-primary-foreground': 'oklch(1 0 0)',
  '--color-brand-secondary': 'oklch(0.577 0.245 27.325)',
};

/**
 * Pink brand theme
 * For Teams/Organizations that want pink branding
 */
export const pinkTheme: ThemeOverrides = {
  '--color-brand-primary': 'oklch(0.769 0.188 70.08)',
  '--color-brand-primary-foreground': 'oklch(0.12 0 0)',
  '--color-brand-secondary': 'oklch(0.627 0.265 303.9)',
};

/**
 * All available themes
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  purple: purpleTheme,
  green: greenTheme,
  blue: blueTheme,
  orange: orangeTheme,
  pink: pinkTheme,
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Apply a theme preset to the root element
 * @param themeName - Name of the theme to apply
 * @param target - Target element (defaults to document root)
 */
export function applyTheme(
  themeName: ThemeName,
  target: HTMLElement = document.documentElement
) {
  const theme = themes[themeName];
  
  if (!theme) {
    console.warn(`[Themes] Theme not found: ${themeName}`);
    return;
  }
  
  Object.entries(theme).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * Apply custom theme overrides
 * @param overrides - Custom CSS variable overrides
 * @param target - Target element (defaults to document root)
 */
export function applyCustomTheme(
  overrides: ThemeOverrides,
  target: HTMLElement = document.documentElement
) {
  Object.entries(overrides).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * Get current theme name (if using class-based theme switching)
 */
export function getCurrentTheme(): ThemeName | null {
  const root = document.documentElement;
  
  if (root.classList.contains('dark')) {
    return 'dark';
  }
  
  // Check for custom theme data attribute
  const customTheme = root.dataset.theme as ThemeName;
  if (customTheme && themes[customTheme]) {
    return customTheme;
  }
  
  return 'light';
}

/**
 * Toggle between light and dark themes
 */
export function toggleDarkMode() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  
  if (isDark) {
    root.classList.remove('dark');
    applyTheme('light');
  } else {
    root.classList.add('dark');
    applyTheme('dark');
  }
}
