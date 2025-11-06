export function isServer() {
  return typeof window === "undefined" || "Deno" in globalThis;
}

export function isClient() {
  return !isServer();
}

export function isIOS() {
  if (isServer()) return false;

  return navigator.userAgent.match(/ipad|iphone/i) !== null;
}

export function isMacOS() {
  if (isServer()) return false;

  return navigator.platform.match(/Macintosh|MacIntel|MacPPC|Mac68K/) !== null;
}

export function isAndroid() {
  if (isServer()) return false;

  return navigator.userAgent.match(/Android/i) !== null;
}

export function isIE() {
  if (isServer()) return false;

  return /MSIE|Trident/i.test(window.navigator.userAgent);
}

export function getOSByUserAgent() {
  if (isServer()) return false;

  if (isIOS()) return "ios";

  if (isAndroid()) return "android";

  return "web";
}

export function isMobileWeb() {
  const userAgent = getOSByUserAgent();

  if (userAgent === "ios" || userAgent === "android") return true;

  return false;
}

export function isKakaoWebView() {
  if (isServer()) return false;

  return /KAKAOTALK/i.test(navigator.userAgent);
}

export function getPlatform() {
  if (isServer()) return "server";
  if (isKakaoWebView()) return "kakao";
  const os = getOSByUserAgent();
  if (os === "ios" || os === "android") return os;
  if (isMacOS()) return "macos";
  return "web";
}
