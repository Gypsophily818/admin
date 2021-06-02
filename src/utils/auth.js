import Cookies from "js-cookie";

const TokenKey = "userToken";
const RefreshToken = "RefreshToken";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
export const getRefreshToken = refreshToken =>
  Cookies.set(RefreshToken, refreshToken);

export const removeRefreshToken = () => Cookies.remove(RefreshToken);

// 暂存登录信息
export const setLocal = (name, val) =>
  localStorage.setItem(name, window.btoa(val));

// 获取登录信息
export const getLocal = name => window.atob(localStorage.getItem(name));

// 销毁登录信息
export const destroyLocalInfo = name => localStorage.removeItem(name);

// 记住我 七天有效期
export const rememberMe = val =>
  Cookies.set("rememberMe", window.btoa(val), { expires: 7 });
// export const rememberMe = val => Cookies.set("rememberMe", val, { expires: 7 });

export const getrememberMe = () => window.atob(Cookies.getJSON("rememberMe"));

export const destoryRememberMe = () => Cookies.remove("rememberMe");
