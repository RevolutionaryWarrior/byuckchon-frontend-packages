function isServer() {
  return typeof window === "undefined" || "Deno" in globalThis;
}

function isClient() {
  return !isServer();
}

function isIOS() {
  if (isServer()) return false;
  return /ipad|iphone/i.test(navigator.userAgent);
}

function isMacOS() {
  if (isServer()) return false;
  return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.platform);
}

function isAndroid() {
  if (isServer()) return false;
  return /Android/i.test(navigator.userAgent);
}

function isIE() {
  if (isServer()) return false;
  return /MSIE|Trident/i.test(navigator.userAgent);
}

function isKakaoWebView() {
  if (isServer()) return false;
  return /KAKAOTALK/i.test(navigator.userAgent);
}

function getOSByUserAgent() {
  if (isServer()) return false;
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "web";
}

function isMobileWeb() {
  const os = getOSByUserAgent();
  return os === "ios" || os === "android";
}

function getPlatform() {
  if (isServer()) return "server";
  if (isKakaoWebView()) return "kakao";

  const os = getOSByUserAgent();
  if (os === "ios" || os === "android") return os;

  if (isMacOS()) return "macos";

  return "web";
}

export const userAgent = {
  isServer,
  isClient,
  isIOS,
  isAndroid,
  isMacOS,
  isIE,
  isKakaoWebView,
  isMobileWeb,
  getOSByUserAgent,
  getPlatform,
};
