<template>
  <div class="log-in">
    <Header />
    <el-container>
      <el-main class="login-container">
        <el-row class="login-wrapper">
          <el-col :xs="24" :sm="24" :md="12" class="login-logo">
            <div class="login-sketch">
              <el-image :src="loginsketch"></el-image>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" class="login-col">
            <div class="title-container">
              <h3 class="title">-&nbsp;用户名登录&nbsp;-</h3>
            </div>

            <el-form
              ref="loginForm"
              :model="loginForm"
              class="input-textarea"
              :rules="registerRules"
            >
              <el-form-item prop="userName">
                <el-input
                  ref="userName"
                  v-model="loginForm.userName"
                  placeholder="请输入用户名"
                  name="userName"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  ref="password"
                  :key="passwordType"
                  :type="passwordType"
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="1"
                  auto-complete="on"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>

              <el-checkbox v-model="loginForm.remember" class="remember"
                >记住我</el-checkbox
              >
              <el-link class="forgot" type="primary" @click="forgotPassword"
                >忘记密码?
              </el-link>

              <el-form-item>
                <el-row>
                  <el-button
                    type="primary"
                    @click.native.prevent="onLogin('loginForm')"
                    class="btn-login"
                    v-loading.fullscreen.lock="fullscreenLoading"
                    >登录</el-button
                  >
                </el-row>
              </el-form-item>

              <el-row>
                <el-link class="register" type="primary" @click="onReigster"
                  >去注册>>
                </el-link>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/layouthome/components/Header.vue";
// import  from ''
import { mapState, mapMutations, mapActions } from "vuex";
import {
  setuserInfo,
  getToken,
  rememberMe,
  getrememberMe,
  destoryRememberMe
} from "@/utils/common.js";
// import * as API from "@/api/enliten";
export default {
  components: {
    Header
  },
  computed: {
    ...mapState(["token", "isUserLogin"])
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    if (getrememberMe()) {
      let loginForm = getrememberMe();
      console.log("===login-loginForm", loginForm);
      this.loginForm.userName = JSON.parse(window.atob(loginForm)).userName;
      this.loginForm.password = JSON.parse(window.atob(loginForm)).password;
      this.loginForm.remember = true;
    } else {
      this.loginForm.remember = false;
    }
  },
  data() {
    let checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      callback();
    };
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      callback();
    };
    return {
      loginsketch: require("@/assets/login/login-sketch.png"),
      loginForm: {
        userName: "",
        password: "",
        remember: false,
        userType: 2
      },
      // 表单验证
      registerRules: {
        userName: [{ validator: checkUserName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }]
      },
      fullscreenLoading: false, //loading
      passwordType: "password",
      redirect: "/dashboard", //undefined,
      otherQuery: {}
    };
  },

  methods: {
    // ...mapMutations(["updateFullscreenLoading"]),
    ...mapActions(["login"]),
    forgotPassword() {
      console.log("forgot");
      this.$router.push("/forgot");
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    onLogin(formName) {
      console.log(formName);
      console.log(this.redirect);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let loginForm = this.loginForm;
          this.fullscreenLoading = true;

          this.$store
            .dispatch("user/login", loginForm)
            .then(response => {
              // this.$router.push({
              //   path: this.redirect || "/",
              //   query: this.otherQuery
              // });
              console.log("response====", response);

              if (response.success) {
                this.$store
                  .dispatch("user/getInfo")
                  .then(result => {
                    console.log("dispatch(‘user/getInfo’)-->", result);
                    this.$router.push("/dashboard");
                  })
                  .catch(() => {
                    this.fullscreenLoading = false;
                  });
              }
              if (!response.success) {
                this.$message.error({
                  message:
                    response.error.details ||
                    response.error.message ||
                    "网络发生不可预估的错误~",
                  duration: 5 * 1000
                });
              }
              this.fullscreenLoading = false;
            })
            .catch(() => {
              this.fullscreenLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onReigster() {
      this.$router.push("/register");
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.token) {
        vm.$message({
          message: "请先退出登录",
          type: "warning"
        });
        console.log(to.path);
        next({
          path: "/home"
        });
      }
    });
  }
};
</script>

<style lang="scss">
$dark_gray: #889aa4;
.log-in {
  .el-container {
    background: url("../../../assets/login/log-bg.png") 100% 100%;
    height: 100vh;
    text-align: center;
    .el-main {
      background: #fff;
      width: 80%;
      height: 80%;
      margin: 60px 10%;
    }
    .login-container {
      .login-wrapper {
        padding-top: 8%;
        .login-col {
          padding: 5% 1%;
          background: #ffffff;
          box-shadow: 0px 2px 8px rgba(64, 65, 67, 0.2);
          .title-container {
            margin-bottom: 30px;
            height: 31px;
            font-size: 1.5rem;
            color: #409eff;
          }
          .input-textarea {
            .el-form-item {
              display: flex;
              justify-content: center;
              .el-form-item__content {
                width: 380px;
                padding: 0;
                margin: 0;
              }
            }
            .show-pwd {
              position: absolute;
              right: 10px;
              top: 0px;
              font-size: 16px;
              color: $dark_gray;
              cursor: pointer;
              user-select: none;
            }
            .remember {
              margin-right: 246px;
              display: inline-block;
            }

            .forgot {
              display: inline-block;
            }

            .btn-login {
              margin-top: 24px;
              margin-bottom: 14px;
              width: 100%;
            }
            .register {
              margin-top: -40px;
            }
          }
        }
      }
    }
  }
}
</style>
