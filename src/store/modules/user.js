import { login, logout, getInfo } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  removeRefreshToken,
  setLocal,
  getLocal,
  destroyLocalInfo,
  getuserInfo,
  rememberMe,
  getrememberMe,
  destroyUserInfo,
  destoryRememberMe
} from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  baseURL: "https://client.homework.enliten.cn/",
  // baseURL: "https://interface.homework.enliten.cn/",
  userName: getLocal("u_name"),
  avatar: getLocal("avatar"),
  refreshToken: getRefreshToken(),
  toDownloadID: "",
  loginedUser: "" //用户登录数据 getLocal("user")
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    state.loginedUser = userInfo;
  },

  SET_NAME: (state, name) => {
    state.userName = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_Prod_baseURL(state, prod) {
    state.baseURL = prod;
  },
  // ------------------------

  updateDownloadID: (state, payload) => {
    console.log("updateDownloadID", payload);
    state.toDownloadID = payload;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password, userType, remember } = userInfo;
    console.log("登录中...");
    return new Promise((resolve, reject) => {
      login({
        userName: userName.trim(),
        password: password,
        userType: userType
      })
        .then(response => {
          const { result } = response;
          console.log("remember", remember);
          console.log("response", response);

          // resolve(remember);
          resolve(response);
          if (response.success) {
            if (remember) {
              rememberMe(
                JSON.stringify({
                  userName: userName.trim(),
                  password: password
                })
              );
            }
            commit("SET_TOKEN", result.accessToken);
            setToken(result.accessToken);
            getRefreshToken(result.refreshToken);
          }
          if (!response.success) {
            this.$message.error({
              message:
                response.error.details ||
                response.error.message ||
                "网络发生不可预估的错误~"
            });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { result } = response;
          console.log("用户基本信息==", result);
          if (!result) {
            reject("Verification failed, please Login again.");
          }

          console.log("state.LoginedUse", state.loginedUser);

          // 存userName,avatar
          setLocal("u_name", result.userName);
          setLocal("avatar", result.avatar_Middle);

          commit("SET_USERINFO", result);
          commit("SET_NAME", result.userName);
          commit("SET_AVATAR", result.avatar_Middle);
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken();
          removeRefreshToken();
          resetRouter();
          commit("SET_TOKEN", "");
          commit("SET_USERINFO", {});
          destroyLocalInfo("u_name");
          destroyLocalInfo("avatar");
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch("tagsView/delAllViews", null, { root: true });
          console.log("dispatch=>tagsView");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },

  // ResetPasswordAuth({ commit, dispatch }, form) {
  //   let { sessionId, phoneNumber, msgCode } = { ...form };
  //   console.log(form);
  //   console.log(sessionId, phoneNumber, msgCode);
  //   return new Promise((resolve, reject) => {
  //     getResetPasswordAuthenticate({
  //       sessionId,
  //       phoneNumber,
  //       msgCode
  //     })
  //       .then(res => {
  //         resolve(res);
  //       })
  //       .catch(err => {
  //         reject(err);
  //       });
  //   });
  // },
  // selectResetAccounts({ commit, state }, params) {
  //   console.log(params);
  //   return new Promise((resolve, reject) => {
  //     getResetAccounts({})
  //       .then(result => {})
  //       .catch(err => {});
  //   });
  // }

  // baseURL prod
  resetbaseURL({ commit }, prodRUL) {
    commit("SET_Prod_baseURL", prodRUL);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
