/**
 * Pejla Design Tokens
 * Export design tokens for use in components
 */

import tokens from './design-tokens.json';

export { tokens };
export * from './tokens.d';

// Re-export tokens with better names
export const {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  animations,
  blur,
  opacity,
  zIndex,
} = tokens;

// Utility function to resolve token references
export function resolveToken(value: string, tokensObj = tokens): string {
  if (typeof value !== 'string') return value;
  
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const path = match[1].split('.');
  let result: any = tokensObj;
  
  for (const key of path) {
    result = result?.[key];
  }
  
  return typeof result === 'string' && result.startsWith('{')
    ? resolveToken(result, tokensObj)
    : result;
}

// Get CSS variable name from token path
export function getTokenVar(path: string): string {
  return `var(--${path.replace(/\./g, '-')})`;
}

// Example usage:
// import { tokens, resolveToken, getTokenVar } from '@/tokens';
// const primaryColor = resolveToken(tokens.colors.semantic.brand.primary);
// const cssVar = getTokenVar('color.brand.primary'); // 'var(--color-brand-primary)'
