import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30 * 1000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // change mapGetter baseURL
    // if (
    //   process.env.VUE_APP_BASE_API === "https://interface.homework.enliten.cn/"
    // ) {
    //   // config.baseURL = process.env.VUE_APP_BASE_API;
    //   store.dispatch("user/resetbaseURL", process.env.VUE_APP_BASE_API);
    // }
    if (getToken()) {
      // console.log(getToken());
      config.headers.Authorization = "Bearer " + getToken();
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    console.log("<---------config===error---------->");
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  // console.log("response", service),

  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log("response", response);

    const res = response.data;

    // if the custom code is not 200, it is judged as an error.
    if (response.status !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000 //30
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 100) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err--->" + error); // for debug
    console.log("=======================", error);
    Message({
      // message: error.message || "网络连接失败~",
      message: "网络连接失败~",
      type: "error",
      duration: 5 * 1000
    });
    // store.dispatch("user/resetToken").then(() => {
    //   location.reload();
    // });
    if (error.code === 201 || error.code === 100) {
      Message({
        message: error.message || "登录过期，请重新登录",
        type: "error",
        duration: 5 * 1000
      });
      store.dispatch("user/resetToken").then(() => {
        location.reload();
      });
    }
    return Promise.reject(error);
  }
);

export default service;
