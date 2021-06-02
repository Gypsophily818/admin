import request from "@/utils/request";
import axios from "axios";

export const baseURL = "https://client.homework.enliten.cn/";

export function login(data) {
  return request({
    url: "/api/User/Login",
    method: "POST",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/api/User/UserInfo",
    method: "GET",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/api/User/LogOut",
    method: "GET"
  });
}
/*************************** */
// 图形验证码(注册)
export const getVerifyCode = () =>
  request({
    url: "/api/User/Register",
    method: "GET"
  });

// 发送注册短信
export const getRegisterSMS = data =>
  request({
    url: "/api/User/RegisterSendSms",
    method: "POST",
    data
  });

// 获取注册
export const getRegister = () =>
  request({
    url: "/api/User/Register",
    method: "POST"
  });

// 图形验证码(重置密码)
export const getVerifyCodeResetPassword = () =>
  request({
    url: "/api/User/ResetPasswordAuthenticate",
    method: "GET"
  });

// 发送重置密码短信
export const getResetPasswordMsg = data =>
  request({
    url: "/api/User/NoAccessTokenSendSMS",
    method: "POST",
    data
  });

// 确认重置身份(下一步)
export const getResetPasswordAuthenticate = data =>
  request({
    url: "/api/User/ResetPasswordAuthenticate",
    method: "POST",
    data
  });

// 选择重置用户
export const getResetAccounts = params =>
  request({
    url: "/api/User/ResetPasswordSelectAccount",
    method: "GET",
    params
  });

// 重置登陆密码
export const postResetPassword = params =>
  request({
    url: "/api/User/ResetPassword",
    method: "POST",
    data: params
  });
