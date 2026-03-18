import posthog from "posthog-js";

const POSTHOG_KEY = "phc_buueQXVC41dx797UsjhRgryvW9eN4ZIPblTcLeFoDUf";
const POSTHOG_HOST = "https://eu.i.posthog.com";

export function initAnalytics() {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog.identify(userId, properties);
}

export function resetUser() {
  posthog.reset();
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  posthog.capture(event, properties);
}

export { posthog };
