import posthog from "posthog-js";

const POSTHOG_KEY = "phc_buueQXVC41dx797UsjhRgryvW9eN4ZIPblTcLeFoDUf";
const POSTHOG_HOST = "https://eu.i.posthog.com";

export function initAnalytics() {
  const consent = localStorage.getItem("pejla-cookie-consent");
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: consent === "accepted",
    capture_pageleave: consent === "accepted",
    autocapture: consent === "accepted",
    persistence: consent === "accepted" ? "localStorage+cookie" : "memory",
    opt_out_capturing_by_default: consent !== "accepted",
  });
  if (consent === "accepted") {
    posthog.opt_in_capturing();
  }
}

export function acceptCookies() {
  localStorage.setItem("pejla-cookie-consent", "accepted");
  posthog.opt_in_capturing();
}

export function declineCookies() {
  localStorage.setItem("pejla-cookie-consent", "declined");
  posthog.opt_out_capturing();
}

export function hasConsented(): boolean {
  return localStorage.getItem("pejla-cookie-consent") !== null;
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
