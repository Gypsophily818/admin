<template>
  <div>
    <!-- 修改登录密码 -->
    <el-row v-if="personalCode === '0'" type="flex" justify="center">
      <el-col :span="20">
        <el-row style="margin-top:-20px;margin-bottom:20px">
          <span
            >请为您的学生<b>{{
              personalInfo.fullName
                ? personalInfo.userName + "(" + personalInfo.fullName + ")"
                : personalInfo.userName
            }}</b
            >设置一个新密码</span
          >
        </el-row>
        <el-form
          :model="passwordForm"
          :rules="rules"
          ref="passwordForm"
          label-width="auto"
        >
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              placeholder="请输入新的登录密码"
              autocomplete="off"
              v-model="passwordForm.password"
            ></el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              type="password"
              show-password
              placeholder="请再次输入新的登录密码"
              autocomplete="off"
              v-model="passwordForm.confirmPassword"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 修改手机号 -->
    <el-row
      v-if="personalCode === '2'"
      style="margin-bottom:-20px;margin-top:-20px"
      type="flex"
      justify="center"
    >
      <el-col :md="12">
        <el-form
          :model="phoneNumberForm"
          :rules="rules"
          ref="phoneNumberForm"
          label-width="auto"
        >
          <el-form-item prop="phoneNumber">
            <el-input
              placeholder="请输入新的手机号码"
              v-model="phoneNumberForm.phoneNumber"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 修改昵称 -->
    <el-row
      v-if="personalCode === '3'"
      style="margin-bottom:-20px;margin-top:-20px"
      type="flex"
      justify="center"
    >
      <el-col :md="12">
        <el-form :model="nickNameForm" ref="nickNameForm" label-width="auto">
          <el-form-item prop="phoneNumber">
            <el-input
              placeholder="请输入新的昵称"
              v-model="nickNameForm.val"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { putUpdateMemberName } from "@/api/class";
import {
  postChangeMemberPassword,
  postChangeMemberPhoneNumber
} from "@/api/member";
import { mapGetters } from "vuex";

export default {
  name: "AddMember",
  props: ["personalInfo", "personalCode", "classInfo"],
  computed: {
    ...mapGetters(["baseURL"])
  },
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.password !== "") {
          this.$refs.passwordForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      classId: this.classInfo.classId,
      userId: this.personalInfo.userId,
      studentId: this.personalInfo.userId, //学生用户Id
      // 修改密码
      passwordForm: {
        classId: "",
        userId: "",
        password: "", //密码
        confirmPassword: "" //确认密码
      },
      // 改手机号码
      phoneNumberForm: {
        classId: "",
        studentId: "",
        phoneNumber: ""
      },
      // 修改昵称
      nickNameForm: {
        val: this.personalInfo.fullName
      },
      personalInfoForm: {
        // 修改密码
        avatarBase64: "", //头像图片base64编码
        fileExtName: "", //图片扩展名
        name: "",
        phoneNumber: "" //新手机号
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ]
      },
      res: "" // 处理结果
      //
    };
  },
  created() {
    console.log("personInput--create");
  },
  watch: {
    keyword(n, o) {
      if (n === "") {
        // 为空==重置
        this.initPage();
        this.getList();
      }
    }
  },
  methods: {
    initPage() {},
    handleClose() {
      this.$emit("close-setting");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.personalCode === "0") {
            // 更改密码
            this.res = await this.changPassword();
          }
          if (this.personalCode === "2") {
            // 更改手机号
            this.res = await this.changPhoneNumber();
          }
          if (this.personalCode === "3") {
            // 修改昵称
            this.res = await this.changNickName();
          }

          console.log("res", this.res);
          if (this.res.success) {
            console.log("成功修改密码==", this.res.result);
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            // 重置表单
            this.resetForm(formName);
            // 成功触发关闭按钮
            this.handleClose();
            if (this.personalCode === "3") {
              // 回流
              this.$emit("reload");
            }
          }

          if (this.res.error) {
            this.$message.error(this.res.error.message);
          }
          this.$refs[formName].clearValidate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changPassword() {
      let changePassWord = {
        classId: this.classId,
        userId: this.userId,
        password: this.passwordForm.password,
        confirmPassword: this.passwordForm.confirmPassword
      };
      console.log("changePassWord", changePassWord);
      return postChangeMemberPassword(changePassWord);
    },
    changPhoneNumber() {
      let changePhoneNumber = {
        classId: this.classId,
        studentId: this.studentId,
        phoneNumber: this.phoneNumberForm.phoneNumber
      };
      console.log("changePhoneNumber", changePhoneNumber);
      return postChangeMemberPhoneNumber(changePhoneNumber);
    },
    changNickName() {
      let newName = this.nickNameForm.val;
      console.log("newName", newName);
      return putUpdateMemberName(this.classId, this.studentId, newName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
    // ------
  }
};
</script>

<style></style>
