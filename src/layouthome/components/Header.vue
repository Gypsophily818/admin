<template>
  <div class="header">
    <div id="nav">
      <b-navbar toggleable="lg" type="dark" class="navbar">
        <b-navbar-brand href="#" class="header-brand">
          <el-image class="logo" :src="url"></el-image>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" class="mycollapse">
          <i class="el-icon-menu"></i>
        </b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="nav-collapse-wiper">
            <b-nav-item @click="NavToHome" :active="$route.name === 'home'">
              首页
            </b-nav-item>
            <b-nav-item
              @click="NavToDownload"
              :active="$route.name === 'DownloadPage'"
              >客户端下载</b-nav-item
            >
            <b-nav-item
              @click="NavToIntro"
              :active="$route.name === 'SetMeatIntroduce'"
              >套餐介绍</b-nav-item
            >
            <b-nav-item
              @click="NavToGuide"
              :active="$route.name === 'UserGuide'"
              >用户指南</b-nav-item
            >
            <b-nav-item @click="NavToAbout" :active="$route.name === 'About'"
              >关于我们</b-nav-item
            >
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto log-wrapper">
            <b-nav-form>
              <b-button
                size="sm"
                class="controller my-2 my-sm-0"
                @click="NavToCtrl"
                >控制台
              </b-button>
              <template>
                <b-button
                  size="sm"
                  class="log-in my-2 my-sm-0"
                  @click="NavToLogIn"
                  v-if="!token"
                  >登录
                </b-button>
                <div class="exits" v-if="token">
                  <div class="block">
                    <el-avatar :size="50" :src="baseURL + avatar"></el-avatar>
                    <el-row class="name">
                      <span>{{ userName }}</span>
                    </el-row>
                  </div>
                </div>
              </template>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapMutations, mapGetters } from "vuex";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
export default {
  computed: {
    ...mapGetters(["avatar", "userName", "token", "baseURL"])
  },
  created() {},
  data() {
    return {
      url: require("@/assets/header/Enliten-logo.svg"),
      fullscreenLoading: false
    };
  },
  methods: {
    ...mapMutations(["updateFullscreenLoading"]),
    NavToHome() {
      this.$router.push("/");
    },
    NavToDownload() {
      this.$router.push("/download");
    },
    NavToIntro() {
      this.$router.push("/setMeatIntroduce");
    },
    NavToGuide() {
      this.$router.push("/userGuide");
    },
    NavToAbout() {
      this.$router.push("/about");
    },
    NavToLogIn() {
      this.$router.push("/login");
    },
    NavToCtrl() {// 控制台
      this.token
        ? this.$router.push("dashboard")
        : (this.$message({
            message: "请先登录",
            type: "warning"
          }),
          this.$router.push("/login"));
    },
    exitLog() {
      console.log("退出登录");
      localStorage.removeItem("Flag");
      this.updateFullscreenLoading(true);
      this.axios
        .get("/api/User/LogOut")
        .then(result => {
          console.log(result);
          this.$store.dispatch("logout");
          this.Cookies.remove("accessToken");
          this.Cookies.remove("refreshToken");
          this.Cookies.remove("userId");
          this.updateFullscreenLoading(false);

          this.$router.push("/login");
        })
        .catch(err => {
          new Error(err);
        });
    },
    async logout() {
      this.fullscreenLoading = true;

      await this.$store
        .dispatch("user/logout")
        .then(() => {
          this.fullscreenLoading = false;

          this.$router.push(`/login`);
        })
        .catch(() => {});
    }
  }
};
</script>
<style
  src="../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style
>;

<style
  scoped
  src="../../../node_modules/bootstrap/dist/css/bootstrap.css"
></style
>;
<style lang="scss" scoped>
.header {
  border: 1px solid #eaedf3;
  box-shadow: 0px 2px 8px rgba(150, 153, 159, 0.1);
  height: 80px;
  z-index: 100;
  .navbar {
    padding: 0;
    .header-brand {
      padding: 0;
      padding-left: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      flex: 1;
      .el-image {
        width: 200px;
      }
    }
    .mycollapse {
      background: #409eff;
      // background: #ccc;
      height: 40px;
      width: 70px;
      margin-right: 10px;
    }
    #nav-collapse {
      z-index: 99;
      color: #3e3f41;
      background: #fff;
      .nav-collapse-wiper {
        flex: 1;
        justify-content: flex-start;
        padding: 0;
        margin: 0;
        line-height: 70px;
        .nav-item {
          margin: 0 12px;
          .nav-link {
            font-size: 0.875rem;
            color: #3e3f41;
            padding: 0;
            &:hover {
              color: #1c7deb;
              border-bottom: 4px solid #1c7deb;
              border-radius: 2px;
              height: 66px;
            }
          }
          .active {
            color: #1c7deb;
            border-bottom: 4px solid #1c7deb;
            border-radius: 2px;
            height: 66px;
          }
          @media (max-width: 991px) {
            display: flex;
            justify-content: center;
            .nav-link {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .active {
              height: 66px;
              color: #1c7deb;
              border-bottom: 4px solid #1c7deb;
              border-radius: 2px;
            }
          }
        }
      }
      .log-wrapper {
        padding-right: 100px;
        .controller {
          margin-right: 10px;
          width: 98px;
          height: 40px;
          color: #409eef;
          background: #fff;
          border: 1px solid #409eef;
        }
        .log-in {
          width: 98px;
          height: 40px;
          background: #409eff;
          opacity: 1;
          border-radius: 4px;
          border: 1px solid #409eef;
        }
        .exits {
          margin-left: 10px;
          .block {
            position: relative;
            display: flex;
            .name {
              margin-left: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
