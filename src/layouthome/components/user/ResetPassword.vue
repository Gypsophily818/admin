<template>
  <div class="reset-page">
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
    <template v-if="!isSelectAccount && !isResetPage">
      <el-col :xs="24" :sm="24" :md="24" class="login-col">
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
              >下一步
            </el-button>
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
                <el-image
                  style="width: 40px; height: 40px"
                  :src="avatarUrl + item.avatar_Middle"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline-round"></i>
                  </div>
                </el-image>
              </div>
              <div class="account-info">
                <p class="account-name">
                  {{ item.userName }}({{
                    item.nickName ? item.nickName : item.userName
                  }})
                </p>
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
          <el-button type="primary" @click="submit_accounter" class="submit-btn"
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
  </div>
</template>

<script>
import { isMobile } from "@/util/validate";
import * as API from "@/api";

export default {
  created() {
    this.refreshVerifyCode();
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
      avatarUrl: API.baseURL,
      active: 0,
      identifyCodeImg: "",
      forgotUserInfo: [], // 账户
      isselect: false,
      isselectIndex: "", //用户选择索引
      userId: "",
      isDisabled: false,
      countText: {
        count: "59",
        click: "获取短信",
      },
      forgotForm: {
        phoneNumber: "",
        identifyCode: "",
        msgCode: "",
      },
      // 表单验证
      forgotRules: {
        phoneNumber: [{ validator: checkPhoneNum, trigger: "blur" }],
        identifyCode: [
          { required: true, message: "图形验证码不能为空", trigger: "blur" },
        ],
      },
      resetPasswordForm: {
        password: "",
        confirmPassword: "",
      },
      resetPasswordFormRules: {
        password: [{ validator: checkPassword, trigger: "blur" }],
        confirmPassword: [{ validator: checkConfirmPassword, trigger: "blur" }],
      },
      isSelectAccount: false, //进入账户选择页面
      isResetPage: false, //进入账户重置密码
    };
  },
  methods: {
    refreshVerifyCode() {
      //获取图形验证码
      API.getRefreshVerifyCode()
        .then((result) => {
          this.identifyCodeImg = result.data.result.imageData;
          this.sessionId = result.data.result.sessionId;
        })
        .catch((err) => {
          new Error(err);
        });
    },
    sendSMS(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let forgotForm = this.forgotForm;
          this.axios({
            url: "/api/User/NoAccessTokenSendSMS",
            method: "POST",
            data: {
              sessionId: this.sessionId,
              phoneNumber: forgotForm.phoneNumber,
              imageCode: forgotForm.identifyCode,
            },
          })
            .then((result) => {
              console.log(result);
              this.$message({
                message: "短信发送成功~",
                type: "success",
              });
              this.countTime();
            })
            .catch((err) => {
              new Error(err);
            });
        }
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
    },
    onsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let forgotForm = this.forgotForm;
          this.axios({
            method: "POST",
            url: "/api/User/ResetPasswordAuthenticate",
            data: {
              sessionId: this.sessionId,
              phoneNumber: forgotForm.phoneNumber,
              smsCode: forgotForm.msgCode,
            },
          })
            .then((result) => {
              this.phoneNumber = result.data.result.phoneNumber;
              this.sessionId = result.data.result.sessionId;
              this.isSelectAccount = true;
              console.log("isSelectAccount===>>", this.isSelectAccount);

              if (this.isSelectAccount) {
                this.axios
                  .get("/api/User/ResetPasswordSelectAccount", {
                    params: {
                      sessionId: this.sessionId,
                      phoneNumber: this.phoneNumber,
                    },
                  })
                  .then((result) => {
                    console.log(result);
                    this.forgotUserInfo = [...result.data.result.users];
                    localStorage.setItem(
                      "forgotUserInfo",
                      JSON.stringify(this.forgotUserInfo)
                    );
                  })
                  .catch((err) => {
                    new Error(err);
                  });
              }
            })
            .catch((err) => {
              new Error(err);
            });
        }
        return false;
      });
    },
    selectAccount(index, userId) {
      this.isselectIndex = index;
      this.userId = userId;
      if (this.isselectIndex === index) {
        this.isselect = true;
      }
    },
    submit_accounter() {
      if (this.userId) {
        // 进入密码重置页面
        console.log(this.userId, this.sessionId, this.phoneNumber);
        this.isResetPage = true;
        this.isSelectAccount = false;
      }
    },
    confirmReset(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let resetPasswordForm = this.resetPasswordForm;
          this.axios({
            url: "/api/User/ResetPassword",
            method: "POST",
            data: {
              sessionId: this.sessionId,
              phoneNumber: this.phoneNumber,
              userId: this.userId,
              password: resetPasswordForm.password,
              confirmPassword: resetPasswordForm.confirmPassword,
            },
          })
            .then((result) => {
              let success = result.data.success;
              if (success) {
                this.$message({
                  showClose: true,
                  message: "密码重置成功",
                  type: "success",
                });
                this.$router.push("/user");
              } else {
                this.$message({
                  showClose: true,
                  message: "修改失败",
                  type: "error",
                });
                this.$router.push("/forgot");
              }
            })
            .catch((err) => {
              this.$message({
                showClose: true,
                message: "修改失败",
                type: "error",
              });
              new Error(err);
            });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.push("/user");
      this.$route.meta.show = true;
    },
  },
  beforeRouteEnter(to, from, next) {
    // ...
    console.log(from.meta);
    from.meta.show = false;
    next();
  },
};
</script>

<style lang="scss">
.reset-page {
  display: flex;
  margin-top: 60px;
  justify-content: center;
  .login-col {
    max-width: 380px;
  }
  .account-wrapper {
    height: 400px;
    overflow: auto;
    border: 1px dashed skyblue;
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
        .account-name {
          // background: lightcoral;
        }
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
</style>
