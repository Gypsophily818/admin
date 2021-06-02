<template>
  <el-drawer
    v-if="personalInfo"
    :visible.sync="settingPersonalVisible"
    direction="rtl"
    size="30%"
    :before-close="handleClose"
  >
    <div slot="title">
      <el-row type="flex" align="middle">
        <!-- baseURL + personalInfo.avatar_Middle -->
        <el-avatar size="medium" :src="avatar"></el-avatar>
        <span style="margin-left:10px">
          {{
            personalInfo.fullName
              ? personalInfo.userName + "(" + personalInfo.fullName + ")"
              : personalInfo.userName
          }}
        </span>
      </el-row>
    </div>

    <div v-if="currentClass.isClassTeacher">
      <!-- 个人信息账号 -->
      <el-card class="box-card">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col>
            <el-button
              class="pan-btn blue-btn"
              style="width:100%;"
              icon=""
              @click="postChangeMemberPassword"
            >
              修改登录密码
            </el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col>
            <el-button
              class="pan-btn blue-btn"
              style="width:100%;"
              icon=""
              @click="changeAvatar"
            >
              修改头像
            </el-button>

            <my-upload
              field="img"
              @src-file-set="srcFileSet"
              @crop-success="cropSuccess"
              v-model="show"
              :width="300"
              :height="300"
              url=""
              :params="params"
              :headers="headers"
              imgFormat="png"
            ></my-upload>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col>
            <el-button
              class="pan-btn blue-btn"
              style="width:100%;"
              icon=""
              @click="changePhoneNumber"
            >
              修改手机号
            </el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col>
            <el-button
              class="pan-btn blue-btn"
              style="width:100%;"
              icon=""
              @click="changeNickName"
            >
              修改昵称
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-row style="margin-left:20px">
      <h3>成长报表</h3>
    </el-row>

    <!-- 日分析报表 -->
    <el-card class="box-card">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col>
          <el-button
            class="pan-btn blue-btn"
            style="width:100%;"
            icon="el-icon-s-order"
            @click=""
          >
            日分析报表
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 周分析报表 -->
    <el-card class="box-card">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col>
          <el-button
            class="pan-btn blue-btn"
            style="width:100%;"
            icon="el-icon-s-marketing"
            @click=""
          >
            周分析报表
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 月分析报表 -->
    <el-card class="box-card">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col>
          <el-button
            class="pan-btn blue-btn"
            style="width:100%;"
            icon="el-icon-s-data"
            @click=""
          >
            月分析报表
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--  密码、头像、手机号、昵称 修改弹窗 -->
    <el-dialog
      v-if="DialogVisible"
      :title="personalCode | statusCode"
      :visible.sync="DialogVisible"
      :append-to-body="true"
      top="40px"
      width="40%"
      :before-close="HandleClose"
    >
      <!-- 表单 -->
      <setting-person-input
        ref="personDialog"
        :personalInfo="personalInfo"
        :classInfo="classInfo"
        :classList="classList"
        :personalCode="personalCode"
        @reload="$emit('reload')"
        @close-setting="handleClose()"
      />
      <!-- @reload="addSuccessReload" -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitSetting">确认</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>

<script>
import "babel-polyfill";
import myUpload from "vue-image-crop-upload/upload-2.vue"; //图片上传

import { putCopyToNewClass } from "@/api/class";

import { postChangeMemberAvatar } from "@/api/member";
import SettingPersonInput from "./SettingPersonInput";
import { mapGetters } from "vuex";

export default {
  name: "SettingClass",
  props: [
    "settingPersonalVisible",
    "personalInfo",
    "classInfo",
    "classList",
    "currentClass"
  ],
  components: { SettingPersonInput, myUpload },
  computed: {
    ...mapGetters(["baseURL"]),
    avatar: {
      set: function(newV) {
        this.currentIndex = newV;
      },
      get: function() {
        this.currentIndex = this.personalInfo.avatar_Middle;
        return this.baseURL + this.currentIndex;
      }
    }
  },
  filters: {
    statusCode(code) {
      const codeMap = {
        "0": "修改登录密码",
        "1": "修改头像",
        "2": "修改手机号",
        "3": "修改昵称"
      };
      return codeMap[code];
    }
  },
  data() {
    return {
      DialogVisible: false, // 弹窗
      personalCode: "0", // '0'-修改登录密码 '1' 修改头像 '2' 修改手机号 '3' 修改昵称
      // 修改头像
      imagecropperKey: 0,
      image: "", // "https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191",
      changeAvatarParams: {
        classId: "",
        studentId: "", //学生用户Id
        avatarBase64: "", //头像图片base64编码
        fileExtName: "" //图片扩展名
      },
      // ----
      show: false,
      params: {
        token: "123456798",
        name: "avatar"
      },
      headers: {
        smail: "*_~"
      },
      imgDataUrl: "" // the datebase64 url of created image
    };
  },
  created() {},
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    srcFileSet(fileName, fileType, fileSize) {
      //图片上传前
      console.log(fileName);
      console.log(fileType);
      let splitArr = fileType.split("/");
      this.changeAvatarParams.fileExtName = splitArr[1];
    },
    async cropSuccess(imgDataUrl, field, imgFormat) {
      console.log("-------- crop success --------");
      console.log(this.personalInfo.userId);
      console.log(this.classInfo.classId);
      console.log("avatarBase64===", imgDataUrl);

      this.changeAvatarParams.classId = this.classInfo.classId;
      this.changeAvatarParams.studentId = this.personalInfo.userId;
      this.changeAvatarParams.avatarBase64 = imgDataUrl;

      console.log(this.changeAvatarParams);
      const res = await postChangeMemberAvatar(this.changeAvatarParams);
      if (res.success) {
        console.log("成功修改头像==", res.result);
        this.$message({
          message: "修改成功!",
          type: "success"
        });
        this.$emit("reload");
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    // ====
    handleClose() {
      this.DialogVisible = false;
      this.$emit("close-setting-drawer");
    },
    postChangeMemberPassword() {
      // 更改成员登录密码
      console.log("修改登录密码");
      this.DialogVisible = true;
      this.personalCode = "0";
    },
    changeAvatar() {
      // 更改成员头像
      console.log("修改头像");
      // 打开选择图片
      this.show = !this.show;
    },
    changePhoneNumber() {
      // 更改成员手机号码
      console.log("修改手机号码");
      this.DialogVisible = true;
      this.personalCode = "2";
    },
    changeNickName() {
      // 更改成员昵称
      console.log("修改昵称");
      this.DialogVisible = true;
      this.personalCode = "3";
    },
    hasAccountHandler() {
      this.DialogVisible = true;
      this.personalCode = "1";
    },
    HandleClose(done) {
      done();
    },
    getChooseMemberUserIdList(list) {
      // 获取机构所有成员添加的userIdList
      this.userIdList = list;
    },
    async submitSetting() {
      if (this.personalCode === "0") {
        //修改登录密码 触发子级 表单 'personDialog' 提交
        this.$refs.personDialog.submitForm("passwordForm");
      }
      if (this.personalCode === "1") {
        console.log("submitSetting==从机构添加");
        console.log(this.userIdList);
        // 提交PUT
        let obj = {
          fromClassId: this.personalInfo.classId,
          toClassId: this.personalInfo.classId,
          userIdList: this.userIdList
        };
        console.log(obj);
        const res = await putCopyToNewClass(obj);
        console.log(res);
        if (res.success) {
          this.$message({
            message: "添加成功~",
            type: "success"
          });
          this.userIdList = [];
          this.confirmDialogVisible = false;
          this.$emit("reload", this.personalInfo.classId);
        }
        if (res.error) {
          this.$message({
            message: res.error.message,
            type: "error"
          });
        }
      }
      if (this.personalCode === "2") {
        //修改手机号
        this.$refs.personDialog.submitForm("phoneNumberForm");
      }
      if ((this.personalCode = "3")) {
        //修改昵称
        this.$refs.personDialog.submitForm("nickNameForm");
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel() {
      this.DialogVisible = false;
    }
  }
};
</script>

<style></style>
