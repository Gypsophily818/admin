<template>
  <div class="register">
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
              <h3 class="title">-&nbsp;用户名注册&nbsp;-</h3>
            </div>

            <el-form
              ref="registerForm"
              :model="registerForm"
              :rules="registerRules"
              class="input-textarea"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="tips.userNameTip"
                placement="top"
              >
                <el-form-item prop="userName">
                  <el-input
                    ref="userName"
                    v-model="registerForm.userName"
                    placeholder="请输入用户名"
                    name="userName"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-tooltip>

              <el-form-item prop="phoneNumber">
                <el-input
                  ref="phoneNumber"
                  v-model.number="registerForm.phoneNumber"
                  placeholder="请输入手机号码"
                  name="phoneNumber"
                  type="text"
                  tabindex="2"
                  autocomplete="on"
                />
              </el-form-item>

              <el-form-item prop="identifyCode" class="identify-code">
                <el-input
                  ref="identifyCode"
                  v-model="registerForm.identifyCode"
                  placeholder="请输入图形验证码"
                  name="identifyCode"
                  type="text"
                  tabindex="3"
                  autocomplete="off"
                />

                <el-image
                  style="width: 100px"
                  :src="identifyCodeImg"
                  @click="refreshVerifyCode"
                ></el-image>
              </el-form-item>

              <el-form-item class="msg-code">
                <el-input
                  ref="msgCode"
                  v-model="registerForm.msgCode"
                  placeholder="请输入验证码"
                  name="msgCode"
                  type="text"
                  tabindex="4"
                  autocomplete="off"
                />
                <el-button
                  class="send-msg"
                  :plain="true"
                  :disabled="isDisabled"
                  @click="getMessageCode('registerForm')"
                  >{{
                    isDisabled ? countText.count + "s后获取" : countText.click
                  }}</el-button
                >
              </el-form-item>

              <!-- <el-form-item class="password-input" prop="password"> -->
              <el-form-item class="password-input">
                <el-input
                  ref="password"
                  placeholder="请输入密码"
                  v-model="registerForm.password"
                  show-password
                  tabindex="5"
                  name="password"
                  type="password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-row>
                <el-button
                  type="primary"
                  @click="onRegister('registerForm')"
                  class="btn-login"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  >注册</el-button
                >
              </el-row>
              <el-row>
                <el-link class="btn-log-up" type="primary" @click="NavToLogIn"
                  >已有账号,去登录>>
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
import { isMobile } from "@/utils/validate";
import { getVerifyCode, getRegisterSMS, getRegister } from "@/api/user";
// getVerifyCode
export default {
  components: {
    Header
  },
  data() {
    let checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        if (value.toString().length < 6 || value.toString().length > 25) {
          callback(new Error("长度6-25个字符"));
          return false;
        }
        callback();
      }
    };
    let checkPhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      } else {
        if (value.toString().length !== 11) {
          callback(new Error("长度11个字符"));
          return false;
        }
        if (!isMobile(value)) {
          callback(new Error("请输入正确的手机号码"));
        }
        callback();
      }
    };

    return {
      loginsketch: require("@/assets/login/login-sketch.png"), //注册图左

      //注册表单
      registerForm: {
        userName: "",
        phoneNumber: "",
        identifyCode: "", //图形验证码
        msgCode: "", //验证码
        password: ""
      },
      // 表单验证
      registerRules: {
        userName: [{ validator: checkUserName, trigger: "blur" }],
        phoneNumber: [{ validator: checkPhoneNum, trigger: "blur" }],
        identifyCode: [
          { required: true, message: "图形验证码不能为空", trigger: "blur" }
        ],
        msgCode: [{ message: "验证码不能为空", trigger: "blur" }],
        password: [{ message: "密码不能为空", trigger: "blur" }]
      },
      passwordType: "",
      tips: {
        userNameTip: "最小6位,最大25位字母数字及下划线",
        passwordTip: ""
      },

      identifyCodeImg: "",
      sessionId: "",
      fullscreenLoading: false,
      isDisabled: false,
      countText: {
        count: "59",
        click: "获取短信"
      }
    };
  },
  created() {
    this.refreshVerifyCode();
  },
  methods: {
    resetRegisterForm() {
      this.registerForm = {
        userName: "",
        phoneNumber: "",
        identifyCode: "",
        msgCode: "",
        password: ""
      };
    },
    getMessageCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fullscreenLoading = true;
          let registerForm = this.registerForm;
          getRegisterSMS({
            sessionId: this.sessionId,
            phoneNumber: registerForm.phoneNumber,
            imageCode: registerForm.identifyCode
          })
            .then(result => {
              console.log(result);
              if (result.success) {
                this.$message({
                  showClose: true,
                  message: "验证码成功发送",
                  type: "success"
                });
                this.countTime();
                this.fullscreenLoading = false;
              } else {
                let msg = result.error.message;
                this.$message.error(msg);
                this.fullscreenLoading = false;
                this.resetRegisterForm();
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    },
    onRegister(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let registerForm = this.registerForm;

          getRegister({
            sessionId: this.sessionId,
            phoneNumber: registerForm.phoneNumber,
            imageCode: registerForm.identifyCode,
            userName: registerForm.userName,
            password: registerForm.password,
            smsCode: registerForm.msgCode,
            userType: 0
          })
            .then(result => {
              console.log("result===>", result);
              if (result.success) {
                this.$message({
                  showClose: true,
                  message: "注册成功",
                  type: "success"
                });
                this.$router.push("/login");
              } else {
                let msg = result.error.validationErrors[0].message;
                this.$message.error(msg);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          console.log("输入错误");
          return false;
        }
      });
      let registerForm = this.registerForm;
      console.log(this.$refs);
      if (registerForm.identifyCode === "") {
        return false;
      }
    },
    NavToLogIn() {
      this.$router.push("/login");
    },
    refreshVerifyCode() {
      getVerifyCode()
        .then(result => {
          this.identifyCodeImg = result.result.imageData;
          this.sessionId = result.result.sessionId;
        })
        .catch(err => {
          new Error(err);
        });
    },
    // 倒计时
    countTime() {
      const TIME_COUNT = 60; //倒计时60秒
      if (!this.timer) {
        this.countText.count = TIME_COUNT;
        this.isDisabled = true;
        this.timer = setInterval(() => {
          if (this.countText.count > 0 && this.countText.count <= TIME_COUNT) {
            this.countText.count--;
          } else {
            this.isDisabled = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss">
.register {
  .el-container {
    background: url("../../../assets/login/log-bg.png") 100% 100%;
    height: 100vh;
    text-align: center;

    .el-main {
      background: #fff;
      width: 80%;
      height: 70%;
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
                line-height: 26px;
              }
              .err-tips {
                width: 346px;
                display: inline-block;
                text-align: left;
                color: #ff4949;
                background: skyblue;
              }
            }
            [class$="-code"] {
              .el-form-item__content {
                display: flex;
                .el-input {
                  margin-right: 10px;
                  flex: 1;
                }
              }
            }
            .identify-code {
              cursor: pointer;
              .el-form-item__content {
                display: flex;
                justify-content: flex-end;
                .el-input {
                  max-width: 278px;
                }
                .el-image {
                  margin-left: 10px;
                }
              }
            }
            .msg-code {
              .el-form-item__content {
                display: flex;
                .el-input {
                  max-width: 278px;
                }
                .send-msg {
                  margin-left: 12px;
                }
                button {
                  padding: 0 10px;
                  // margin-left: 10px;
                  color: #1989fa;
                }
              }
            }
          }
          .remember {
            width: 190px;
            text-align: left;
          }
          .forgot {
            display: inline-block;
            text-align: right;
            width: 190px;
          }
          .btn-login {
            width: 100%;
            max-width: 380px;
            margin-bottom: 14px;
          }
        }
      }
    }
  }
}
</style>
