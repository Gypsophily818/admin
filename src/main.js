import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "./icons"; // icon
// import "./permission"; // permission control
import "./router_config"; //
import "./utils/error-log"; // error log

import * as filters from "./filters"; // global filters
// ------

// seo
import MetaInfo from 'vue-meta-info'
Vue.use(MetaInfo)

// if (process.env.NODE_ENV === "production") {
//   const { mockXHR } = require("../mock");
//   mockXHR();
// }

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  mounted() {
    document.dispatchEvent(new Event("render-event"));
  }
});
