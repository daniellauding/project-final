import { test, expect } from '@playwright/test';

test.describe('Pejla Dev vs Prod Comparison', () => {
  
  test('Compare hero section layout', async ({ page }) => {
    // Dev version
    await page.goto('http://100.110.129.19:5174/welcome');
    await page.waitForLoadState('networkidle');
    
    const devMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const heading = document.querySelector('h1');
      const logo = document.querySelector('header a[href="/"]');
      
      return {
        header: header ? {
          height: window.getComputedStyle(header).height,
          paddingTop: window.getComputedStyle(header).paddingTop,
          paddingBottom: window.getComputedStyle(header).paddingBottom,
        } : null,
        heading: heading ? {
          fontSize: window.getComputedStyle(heading).fontSize,
          lineHeight: window.getComputedStyle(heading).lineHeight,
          marginTop: window.getComputedStyle(heading).marginTop,
          marginBottom: window.getComputedStyle(heading).marginBottom,
        } : null,
        logo: logo ? {
          width: window.getComputedStyle(logo).width,
          height: window.getComputedStyle(logo).height,
        } : null,
      };
    });
    
    await page.screenshot({ 
      path: '/tmp/pejla-dev-hero.png',
      fullPage: false 
    });
    
    // Prod version
    await page.goto('https://pejla.io/welcome');
    await page.waitForLoadState('networkidle');
    
    const prodMetrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const heading = document.querySelector('h1');
      const logo = document.querySelector('header a[href="/"]');
      
      return {
        header: header ? {
          height: window.getComputedStyle(header).height,
          paddingTop: window.getComputedStyle(header).paddingTop,
          paddingBottom: window.getComputedStyle(header).paddingBottom,
        } : null,
        heading: heading ? {
          fontSize: window.getComputedStyle(heading).fontSize,
          lineHeight: window.getComputedStyle(heading).lineHeight,
          marginTop: window.getComputedStyle(heading).marginTop,
          marginBottom: window.getComputedStyle(heading).marginBottom,
        } : null,
        logo: logo ? {
          width: window.getComputedStyle(logo).width,
          height: window.getComputedStyle(logo).height,
        } : null,
      };
    });
    
    await page.screenshot({ 
      path: '/tmp/pejla-prod-hero.png',
      fullPage: false 
    });
    
    // Compare metrics
    console.log('\n📊 DEV METRICS:');
    console.log(JSON.stringify(devMetrics, null, 2));
    console.log('\n📊 PROD METRICS:');
    console.log(JSON.stringify(prodMetrics, null, 2));
    
    // Assertions
    expect(devMetrics.header?.height).toBe(prodMetrics.header?.height);
    expect(devMetrics.heading?.fontSize).toBe(prodMetrics.heading?.fontSize);
    expect(devMetrics.logo?.width).toBe(prodMetrics.logo?.width);
  });
  
  test('Compare button styling', async ({ page }) => {
    await page.goto('http://100.110.129.19:5174/welcome');
    await page.waitForLoadState('networkidle');
    
    const devButton = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn ? {
        padding: window.getComputedStyle(btn).padding,
        borderRadius: window.getComputedStyle(btn).borderRadius,
        fontSize: window.getComputedStyle(btn).fontSize,
        backgroundColor: window.getComputedStyle(btn).backgroundColor,
      } : null;
    });
    
    await page.goto('https://pejla.io/welcome');
    await page.waitForLoadState('networkidle');
    
    const prodButton = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return btn ? {
        padding: window.getComputedStyle(btn).padding,
        borderRadius: window.getComputedStyle(btn).borderRadius,
        fontSize: window.getComputedStyle(btn).fontSize,
        backgroundColor: window.getComputedStyle(btn).backgroundColor,
      } : null;
    });
    
    console.log('\n🔘 DEV BUTTON:');
    console.log(JSON.stringify(devButton, null, 2));
    console.log('\n🔘 PROD BUTTON:');
    console.log(JSON.stringify(prodButton, null, 2));
    
    expect(devButton?.borderRadius).toBe(prodButton?.borderRadius);
    expect(devButton?.fontSize).toBe(prodButton?.fontSize);
  });
  
});
