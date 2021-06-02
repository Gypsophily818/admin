<template>
  <div class="forgot-page log-in">
    <Header />
    <el-container>
      <el-main class="login-container">
        <el-row class="login-wrapper">
          <el-col :xs="24" :sm="24" :md="12" class="login-logo">
            <div class="login-sketch">
              <el-image :src="loginsketch"></el-image>
            </div>
          </el-col>
          <template v-if="!isSelectAccount && !isResetPage">
            <el-col :xs="24" :sm="24" :md="12" class="login-col">
              <div class="title-container">
                <h3 class="title">&nbsp;身份认证(密码)&nbsp;</h3>
              </div>

              <el-form
                ref="forgotForm"
                :model="forgotForm"
                :rules="forgotRules"
                class="input-textarea"
              >
                <el-form-item prop="phoneNumber">
                  <el-input
                    ref="phoneNumber"
                    v-model.number="forgotForm.phoneNumber"
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
                    v-model="forgotForm.identifyCode"
                    placeholder="请输入图形验证码"
                    name="identifyCode"
                    type="text"
                    tabindex="3"
                    autocomplete="off"
                  />

                  <el-image
                    style="width: 92px"
                    :src="identifyCodeImg"
                    @click="refreshVerifyCode"
                  ></el-image>
                </el-form-item>

                <el-form-item class="msg-code">
                  <el-input
                    ref="msgCode"
                    v-model="forgotForm.msgCode"
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
                    @click="sendSMS('forgotForm')"
                    >{{
                      isDisabled ? countText.count + "s后获取" : countText.click
                    }}</el-button
                  >
                </el-form-item>

                <el-row>
                  <el-button
                    type="primary"
                    @click="onsubmit('forgotForm')"
                    class="btn-login"
                    >下一步</el-button
                  >
                </el-row>
              </el-form>
            </el-col>
          </template>

          <!-- 选择要修改的用户 -->
          <template v-if="isSelectAccount">
            <el-col :xs="24" :sm="24" :md="12" class="select-account">
              <div class="title-container">
                <h4 class="title">选择要修改的用户</h4>
              </div>
              <el-row>
                <ul class="account-wrapper">
                  <li
                    class="account-item"
                    v-for="(item, index) in forgotUserInfo"
                    :key="index"
                    @click="selectAccount(index, item.userId)"
                  >
                    <div class="avatar">
                      <el-avatar
                        :src="avatarUrl + item.avatar_Middle"
                      ></el-avatar>
                    </div>
                    <div class="account-info">
                      {{ item.userName }}({{
                        item.nickName ? item.nickName : item.userName
                      }})
                    </div>
                    <div class="selection">
                      <el-button
                        size="small"
                        :type="index === isselectIndex ? 'success' : ''"
                        icon="el-icon-check"
                        circle
                        class="select-btn"
                      ></el-button>
                    </div>
                  </li>
                </ul>
              </el-row>
              <el-row class="submit-accounter" :xs="24" :sm="24" :md="12">
                <el-button
                  type="primary"
                  @click="submit_accounter"
                  class="submit-btn"
                  >提交</el-button
                >
              </el-row>
            </el-col>
          </template>

          <template v-if="isResetPage && !isSelectAccount">
            <el-col :xs="24" :sm="24" :md="12" class="select-account">
              <div class="title-container">
                <h4 class="title">重置密码</h4>
              </div>
              <el-row>
                <el-form
                  ref="resetPasswordForm"
                  :model="resetPasswordForm"
                  :rules="resetPasswordFormRules"
                  class="input-textarea"
                >
                  <el-form-item prop="password">
                    <el-input
                      ref="password"
                      v-model="resetPasswordForm.password"
                      placeholder="请输入密码"
                      name="password"
                      type="password"
                      tabindex="1"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-form-item prop="confirmPassword">
                    <el-input
                      ref="confirmPassword"
                      v-model="resetPasswordForm.confirmPassword"
                      placeholder="请再次输入密码"
                      name="confirmPassword"
                      type="password"
                      tabindex="1"
                      autocomplete="off"
                    />
                  </el-form-item>
                  <el-row class="submit-accounter" :xs="24" :sm="24" :md="12">
                    <el-button
                      type="primary"
                      class="submit-btn"
                      @click="confirmReset('resetPasswordForm')"
                      >确认</el-button
                    >
                  </el-row>
                </el-form>
              </el-row>
            </el-col>
          </template>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from "@/layouthome/components/Header.vue";
import { isMobile } from "@/utils/validate";
import {
  baseURL,
  getVerifyCodeResetPassword,
  getResetPasswordMsg,
  getResetPasswordAuthenticate,
  getResetAccounts,
  postResetPassword
} from "@/api/user";

export default {
  components: {
    Header
  },
  created() {
    // // 测试选择用户页面
    // this.isSelectAccount = true;

    // 获取图形验证码
    this.refreshVerifyCode();

    this.forgotUserInfo = JSON.parse(
      window.localStorage.getItem("forgotUserInfo")
    );
    console.log("forgotUserInfo==>", this.forgotUserInfo);
  },
  data() {
    let checkPhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      } else {
        if (!isMobile(value)) {
          callback(new Error("请输入正确的手机号码"));
        }
        callback();
      }
    };
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (value.toString().length < 6 || value.toString().length > 25) {
        // 最小6位,最大25位字母数字及下划线
        callback(new Error("最小6位,最大25位字母数字及下划线"));
      } else {
        callback();
      }
    };
    let checkConfirmPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      avatarUrl: baseURL,
      loginsketch: require("@/assets/login/login-sketch.png"),
      identifyCodeImg: "",
      sessionId: "",

      forgotForm: {
        phoneNumber: "",
        identifyCode: "",
        msgCode: ""
      },
      resetPasswordForm: {
        password: "",
        confirmPassword: ""
      },
      // 表单验证
      forgotRules: {
        phoneNumber: [{ validator: checkPhoneNum, trigger: "blur" }],
        identifyCode: [
          { required: true, message: "图形验证码不能为空", trigger: "blur" }
        ]
      },
      resetPasswordFormRules: {
        password: [{ validator: checkPassword, trigger: "blur" }],
        confirmPassword: [{ validator: checkConfirmPassword, trigger: "blur" }]
      },
      isDisabled: false,
      countText: {
        count: "59",
        click: "获取短信"
      },
      // 账户
      forgotUserInfo: [],
      isselect: false,
      isselectIndex: "", //用户选择索引
      userId: "",
      isSelectAccount: false, //进入账户选择页面
      isResetPage: false //进入账户重置密码
    };
  },
  methods: {
    refreshVerifyCode() {
      //获取图形验证码
      getVerifyCodeResetPassword()
        .then(result => {
          this.identifyCodeImg = result.result.imageData;
          this.sessionId = result.result.sessionId;
        })
        .catch(err => {
          new Error(err);
        });
    },
    sendSMS(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let forgotForm = this.forgotForm;
          console.log("sessionId--->", this.sessionId);
          getResetPasswordMsg({
            sessionId: this.sessionId,
            phoneNumber: forgotForm.phoneNumber,
            imageCode: forgotForm.identifyCode
          })
            .then(result => {
              console.log(result);
              if (result.success) {
                this.$message({
                  message: "短信发送成功~",
                  type: "success"
                });
                this.countTime();
              } else {
                this.$notify.error({
                  title: "错误",
                  message: result.error.message
                });
              }
            })
            .catch(err => {
              new Error(err);
            });
        }
      });
    },
    // 倒计时
    countTime() {
      const TIME_COUNT = 60;
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
    },
    onsubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let forgotForm = { ...this.forgotForm, sessionId: this.sessionId };

          if (!this.forgotForm.msgCode) {
            this.$notify.error({
              title: "错误",
              message: "请输入短信验证码"
            });
            return;
          }
          this.isSelectAccount = true;

          console.log(forgotForm);
          console.log("111---", this.sessionId);
          // 下一步 (确认重置身份)
          let step1Obj = {
            sessionId: this.sessionId,
            phoneNumber: forgotForm.phoneNumber,
            smsCode: forgotForm.msgCode
          };
          const step1 = await getResetPasswordAuthenticate(step1Obj);
          console.log("step1===", step1);
          if (step1.success) {
            this.phoneNumber = step1.result.phoneNumber;
            this.sessionId = step1.result.sessionId;
            this.isSelectAccount = true;
            let step2Obj = {
              sessionId: this.sessionId,
              phoneNumber: this.phoneNumber
            };

            console.log("step2Obj===", step2Obj);

            const step2 = await getResetAccounts(step2Obj);

            console.log("getResetAccounts---", step2);
            if (step2.success) {
              this.forgotUserInfo = [...step2.result.users];
              localStorage.setItem(
                "forgotUserInfo",
                JSON.stringify(this.forgotUserInfo)
              );
            }
            if (step2.error) {
              this.$notify.error({
                title: "错误",
                message: step2.error.message
              });
            }
          }
          if (step1.error) {
            this.$notify.error({
              title: "错误",
              message: step1.error.message
            });
          }
        }
      });
    },
    selectAccount(index, userId) {
      // 获取用户id
      this.isselectIndex = index;
      this.userId = userId;
      if (this.isselectIndex === index) {
        this.isselect = true;
      }
    },
    submit_accounter() {
      // 有用户id 允许进入
      if (this.userId) {
        // 进入密码重置页面
        console.log(this.userId, this.sessionId, this.phoneNumber);
        this.isResetPage = true;
        this.isSelectAccount = false;
      }
    },
    confirmReset(formName) {
      // 重置密码提交
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let resetPasswordForm = this.resetPasswordForm;
          // console.log(this.axios);
          let obj = {
            sessionId: this.sessionId,
            phoneNumber: this.phoneNumber,
            userId: this.userId,
            password: resetPasswordForm.password,
            confirmPassword: resetPasswordForm.confirmPassword
          };
          const res = await postResetPassword(obj);
          console.log(res);
          if (res.success) {
            this.$message({
              showClose: true,
              message: "密码重置成功",
              type: "success",
              duration: 4 * 1000
            });
            this.$router.push("/login");
          }
          if (res.error) {
            this.$message.error({
              message: res.error.message || "网络出错~",
              duration: 4 * 1000
            });
            // 重置密码出错,重新验证
            this.$router.push("/forgot");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.forgot-page {
  .el-container {
    background: url("../../../assets/login/log-bg.png") 100% 100%;
    height: 100vh;
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
          text-align: center;
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
              }
            }
            [class$="-code"] {
              .el-form-item__content {
                display: flex;
                .el-input {
                  margin-right: 6px;
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
                button {
                  padding: 0 10px;
                  margin-left: 10px;
                  color: #1989fa;
                }
              }
            }
          }
          .btn-login {
            width: 100%;
            max-width: 380px;
            margin-bottom: 14px;
          }
        }
        .select-account {
          border: 1px solid #1989fa;
          text-align: center;
          .account-wrapper {
            height: 400px;
            overflow: auto;
            padding: 2%;
            margin: 10px 5%;
            .account-item {
              height: 50px;
              margin: 10px 0;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              .avatar {
                align-items: center;
                border-radius: 50%;
              }
              .account-info {
                padding-left: 8px;
                text-align: left;
                flex: 1;
                min-width: 150px;
                height: 50px;
                line-height: 50px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .selection {
                justify-content: flex-end;
                display: flex;
                .select-btn {
                  justify-content: flex-end;
                }

                .selected {
                  background: white;
                }
              }
            }
          }
        }
        .submit-accounter {
          .submit-btn {
            width: 100%;
            max-width: 380px;
            margin-bottom: 14px;
          }
        }
      }
    }
  }
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
  }
  [class$="-code"] {
    .el-form-item__content {
      display: flex;
      .el-input {
        margin-right: 6px;
        flex: 1;
      }
    }
  }
}
</style>
