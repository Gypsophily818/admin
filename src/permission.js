import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  next();
  console.log(document.title);
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
      // generate accessible routes map based on roles
      const accessRoutes = await store.dispatch("permission/generateRoutes");

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // set the replace: true, so the navigation will not leave a history record
      //   next({ ...to, replace: true });
      // } catch (error) {
      //   // remove token and go to login page to re-login
      //   await store.dispatch("user/resetToken");
      //   Message.error(error || "Has Error");
      //   next(`/login?redirect=${to.path}`);
      //   NProgress.done();
      // }
      next();
    }
  } else {
    /* has no token*/
    // 用户想进入需要登录的页面，则定向回登录界面
    if (to.meta.requireAuth) {
      next({
        path: "/login"
      });
      ElementUI.Message({
        message: "请先登录",
        type: "warning"
      });
      //用户进入无需登录的界面，则跳转继续
    } else {
      next();
    }
  }
});
// if (whiteList.indexOf(to.path) !== -1) {
// do somethings
// }

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
