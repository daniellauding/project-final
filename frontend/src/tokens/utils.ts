/**
 * Design Token Utilities
 * Helper functions for accessing and manipulating design tokens
 */

import tokens from './design-tokens.json';

/**
 * Get a design token value by path
 * @example getToken('colors.primitive.purple.500') => 'oklch(0.72 0.11 270)'
 * @example getToken('spacing.scale.4') => 16
 */
export function getToken(path: string): string | number {
  const keys = path.split('.');
  let value: any = tokens;
  
  for (const key of keys) {
    if (value[key] === undefined) {
      console.warn(`[Tokens] Token not found: ${path}`);
      return '';
    }
    value = value[key];
  }
  
  // Resolve token references like "{colors.primitive.purple.500}"
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const refPath = value.slice(1, -1);
    return getToken(refPath);
  }
  
  return value;
}

/**
 * Get CSS variable reference for a token
 * @example getVar('color', 'brand', 'primary') => 'var(--color-brand-primary)'
 * @example getVar('spacing', '4') => 'var(--spacing-4)'
 */
export function getVar(...parts: (string | number)[]): string {
  const varName = parts.join('-');
  return `var(--${varName})`;
}

/**
 * Get spacing value by scale
 * @example getSpacing(4) => 'var(--spacing-4)' (16px)
 * @example getSpacing(8) => 'var(--spacing-8)' (32px)
 */
export function getSpacing(scale: number | string): string {
  return `var(--spacing-${scale})`;
}

/**
 * Get color value by path
 * @example getColor('brand', 'primary') => 'var(--color-brand-primary)'
 * @example getColor('gray', '500') => 'var(--color-gray-500)'
 */
export function getColor(...path: string[]): string {
  return getVar('color', ...path);
}

/**
 * Get radius value
 * @example getRadius('lg') => 'var(--radius-lg)'
 */
export function getRadius(size: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'): string {
  return `var(--radius-${size})`;
}

/**
 * Get shadow value
 * @example getShadow('md') => 'var(--shadow-md)'
 */
export function getShadow(size: 'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'): string {
  return `var(--shadow-${size})`;
}

/**
 * Apply theme overrides to root element
 * Used for custom brand themes (Teams/Organizations feature)
 * @example applyTheme({ '--color-brand-primary': '#8b5cf6' })
 */
export function applyTheme(overrides: Record<string, string>, target: HTMLElement = document.documentElement) {
  Object.entries(overrides).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * Reset theme to defaults (remove all custom properties)
 */
export function resetTheme(target: HTMLElement = document.documentElement) {
  const style = target.style;
  const customProps = Array.from(style).filter(prop => prop.startsWith('--'));
  customProps.forEach(prop => style.removeProperty(prop));
}

/**
 * Get all tokens of a specific category
 * @example getTokenCategory('spacing.scale') => { 0: 0, 1: 4, 2: 8, ... }
 */
export function getTokenCategory(path: string): Record<string, any> {
  return getToken(path) as Record<string, any>;
}

// Type exports for better TypeScript support
export type ColorToken = keyof typeof tokens.colors.semantic;
export type SpacingToken = keyof typeof tokens.spacing.scale;
export type TypographyToken = keyof typeof tokens.typography.fontSizes;
export type RadiusToken = keyof typeof tokens.radii;
export type ShadowToken = keyof typeof tokens.shadows;
