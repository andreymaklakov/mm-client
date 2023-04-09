const TOKEN_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";
const USERID_KEY = "user-local-id";

export function setTokens({
  refreshToken,
  accessToken,
  userId,
  expiresIn = 3600
}) {
  const expiresDate = new Date().getTime() + expiresIn * 1000;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate);
  localStorage.setItem(USERID_KEY, userId);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getExpiresDateToken() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function getUserId() {
  return localStorage.getItem(USERID_KEY);
}

export function removeAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USERID_KEY);
}

export function setTheme(color) {
  return localStorage.setItem("theme", color);
}

export function getTheme() {
  return localStorage.getItem("theme");
}

const localStorageService = {
  setTokens,
  getAccessToken,
  getExpiresDateToken,
  getRefreshToken,
  getUserId,
  removeAuthData,
  setTheme,
  getTheme
};

export default localStorageService;
