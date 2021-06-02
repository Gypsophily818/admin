import router from "./router";
import store from "./store";
import { Message } from "element-ui";

import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const whiteList = ["/login", "/forgot",'/']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  // console.log(hasToken);
  next();
  // console.log("document-title==>", to.meta, document.title);
  if (hasToken) {
    if (to.path === "/login" || to.path === "/register") {
      // if is logged in, redirect to the home page
      Message({
        message: "请先退出登录",
        type: "warning"
      });
      next({ path: "/home" });
      NProgress.done();
    } else {
      store.commit("router/SET_ROUTES");
      next();
      try {
      } catch (error) {
        console.log("hasToken-->error", error);
      }
    }
  } else {
    /* has no token*/
    // 用户想进入需要登录的页面，则定向回登录界面
    if (to.meta.requireAuth) {
      next({
        path: "/login"
      });
      Message({
        message: "请先登录",
        type: "warning"
      });
      //用户进入无需登录的界面，则跳转继续
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
