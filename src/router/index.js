import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
/* Layouthome(enliten.cn) */
import Layouthome from "@/layouthome";

/* Router Modules */
// import componentsRouter from "./modules/components";
// import chartsRouter from "./modules/charts";
import tableRouter from "./modules/table";
// import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "profile", icon: "user", noCache: true }
      }
    ]
  },

  // layouthome
  {
    path: "/redirect",
    component: Layouthome,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/layouthome/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      title: "登录",
      requireAuth: false
    },
    component: () => import("@/views/layouthome/login/Login.vue")
    // component: () => import("@/views/login/index")
  },
  {
    path: "/register",
    name: "Register",
    hidden: true,
    meta: {
      title: "注册",
      requireAuth: false
    },
    component: () => import("@/views/layouthome/register/Register.vue")
  },
  {
    path: "/forgot",
    name: "Forgot",
    hidden: true,
    meta: {
      title: "忘记密码",
      requireAuth: false
    },
    component: () => import("@/views/layouthome/forgot/Forgot.vue")
  },
  {
    path: "/",
    component: Layouthome,
    redirect: "/home",
    hidden: true,
    children: [
      {
        path: "home",
        name: "home",
        meta: {
          title: "首页",
          requireAuth: false
        },
        component: () => import("@/views/layouthome/home/Home.vue")
      },
      {
        path: "download",
        name: "DownloadPage",
        meta: {
          title: "客户端下载",
          requireAuth: false
        },
        component: () => import("@/views/layouthome/download/Download.vue")
      },
      {
        path: "setMeatIntroduce",
        name: "SetMeatIntroduce",
        meta: {
          title: "套餐介绍",
          requireAuth: false
        },
        component: () =>
          import("@/views/layouthome/setMeatIntroduce/SetMeatIntroduce.vue")
      },
      {
        path: "userGuide",
        name: "UserGuide",
        meta: {
          title: "用户指南",
          requireAuth: false
        },
        component: () => import("@/views/layouthome/userGuide/UserGuide.vue")
      },
      {
        path: "about",
        name: "About",
        meta: {
          title: "关于我们",
          requireAuth: false
        },
        component: () => import("@/views/layouthome/about/About.vue")
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          title: "首页",
          icon: "dashboard",
          affix: true,
          requireAuth: true
        }
      }
    ]
  },
  // tableRouter,
  {
    path: "/report",
    component: Layout,
    // meta: { title: "查看报告", icon: "chart", requireAuth: true },
    children: [
      {
        path: "index",
        component: () => import("@/views/Elt_report/index"),
        name: "Report",
        meta: { title: "查看报告", icon: "chart", requireAuth: true }
      },
      {
        path: "detail",
        component: () => import("@/views/Elt_report/Detail"),
        name: "ReportDetail",
        meta: { title: "报告详情", icon: "chart", requireAuth: true },
        hidden: true
      }
    ]
  },
  {
    path: "/record",
    component: Layout,
    redirect: "/record/index",
    name: "Record",
    meta: { title: "作业管理", icon: "form", requireAuth: true },
    children: [
      {
        path: "index",
        component: () => import("@/views/Elt_record/index"),
        name: "RecordPage",
        meta: {
          title: "布置记录",
          icon: "list",
          requireAuth: true,
          keepAlive: true
        }
      },
      {
        path: "publish", //"index",
        component: () => import("@/views/Elt_homework/index"),
        name: "Homework",
        meta: { title: "布置作业", icon: "edit" },
        hidden: true
      },
      {
        path: "studentRecord",
        component: () => import("@/views/Elt_record/StudentRecord"),
        name: "StudentRecord",
        meta: { title: "学生做题记录" },
        hidden: true
      }
    ]
  },
  {
    path: "/wrong",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/Elt_wrong/index"),
        name: "Wrong",
        meta: { title: "错题本", icon: "documentation" }
      }
    ]
  },
  {
    path: "/class",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/Elt_class/index"),
        name: "Class",
        meta: { title: "班级管理", icon: "peoples" }
      }
    ]
  },
  {
    path: "/examdatabase",
    component: Layout,
    redirect: "/examdatabase/index",
    name: "Examdatabase",
    meta: {
      title: "题库管理",
      icon: "el-icon-s-help"
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/Elt_examdatabase/index"),
        name: "ExamdatabasePage",
        meta: { title: "题库", icon: "clipboard" }
      },
      {
        path: "bookDetail",
        component: () => import("@/views/Elt_examdatabase/BookDetail"),
        name: "BookDetail",
        meta: { title: "练习册详情", icon: "education", keepAlive: true },
        hidden: true
      },
      {
        path: "paperDetail",
        component: () => import("@/views/Elt_examdatabase/PaperDetail"),
        name: "PaperDetail",
        meta: { title: "试卷题目", icon: "form" },
        // meta: { title: "试卷题目", icon: "form", keepAlive: true },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
