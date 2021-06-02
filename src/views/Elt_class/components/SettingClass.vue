<template>
  <el-drawer
    :title="ClassOfAll.currentClass.className + ' - 班级设置'"
    :visible.sync="settingClassVisible"
    direction="rtl"
    size="30%"
    :before-close="handleClose"
  >
    <!-- 创建新学生账号 -->
    <el-card class="box-card">
      <span>添加成员</span>
      <el-row :gutter="10" type="flex" justify="center">
        <el-button
          class="pan-btn blue-btn"
          style="margin-top:5px"
          icon="el-icon-plus"
          @click="newAccountBtn"
        >
          创建新学生账号
        </el-button>
      </el-row>

      <el-row :gutter="10" type="flex" justify="center">
        <el-button
          class="pan-btn blue-btn"
          style="margin-top:5px"
          icon="el-icon-plus"
          @click="hasAccountBtn"
        >
          从机构所有成员
        </el-button>
      </el-row>
    </el-card>

    <el-card
      class="box-card"
      v-if="ClassOfAll.currentClass.allowChangeClassName"
    >
      <el-row type="flex" justify="center">
        <el-button
          class="pan-btn blue-btn"
          icon="el-icon-edit"
          @click="updateNameHandler"
        >
          更改班名称
        </el-button>
      </el-row>
    </el-card>

    <el-card
      class="box-card"
      v-if="ClassOfAll.currentClass.allowTransferOfClassTeacher"
    >
      <el-row type="flex" justify="center">
        <el-button
          class="pan-btn blue-btn"
          icon="el-icon-edit"
          @click="TransferClassTeacherHandler"
        >
          转让班主任
        </el-button>
      </el-row>
    </el-card>

    <el-card class="box-card" v-if="ClassOfAll.currentClass.isClassTeacher">
      <el-row type="flex" justify="center">
        <el-button
          class="pan-btn pink-btn"
          icon="el-icon-minus"
          @click="deleteClassBtn"
        >
          解散班级
        </el-button>
      </el-row>
    </el-card>

    <!--  添加成员弹窗 -->
    <el-dialog
      v-if="newAccountDialogVisible"
      :title="NewAccountCode === '0' ? '创建新学生账号' : '从机构所有成员添加'"
      :visible.sync="newAccountDialogVisible"
      :append-to-body="true"
      top="40px"
      :width="NewAccountCode === '0' ? '40%' : '50%'"
      :before-close="updateClassHandleClose"
    >
      <add-member
        :currentClass="ClassOfAll.currentClass"
        ref="commitAddNewAccount"
        :NewAccountCode="NewAccountCode"
        @chooseMemberUserIdList="getChooseMemberUserIdList"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitNewAccount">确认添加</el-button>
      </span>
    </el-dialog>

    <!-- 转让班主任==弹窗 -->
    <el-dialog
      v-if="transferClassTeacherVisible"
      title="转让班主任"
      :visible.sync="transferClassTeacherVisible"
      :append-to-body="true"
      top="40px"
      width="50%"
      :before-close="updateClassHandleClose"
    >
      <add-member
        :currentClass="ClassOfAll.currentClass"
        ref="commitAddNewAccount"
        :NewAccountCode="NewAccountCode"
        @chooseTeacherInfo="getNewTeacherInfo"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitNewAccount">确认转让</el-button>
      </span>
    </el-dialog>

    <!--  更改班级名称弹窗 -->
    <el-dialog
      v-if="updateNameDialogVisible"
      title="更改班级名称"
      :visible.sync="updateNameDialogVisible"
      :append-to-body="true"
      width="30%"
      top="40px"
      :before-close="updateClassHandleClose"
    >
      <el-form
        :model="newClassNameForm"
        ref="newClassNameForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="newClassNameFormRules"
      >
        <el-form-item label="班级名称" prop="className">
          <el-input
            type="text"
            @keypress.native.enter="submitForm('newClassNameForm')"
            v-model="newClassNameForm.className"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('newClassNameForm')"
          >确认修改</el-button
        >
      </span>
    </el-dialog>

    <!--  解散班级弹窗 -->
    <el-dialog
      v-if="dimissClassDialogVisible"
      title="提示"
      :visible.sync="dimissClassDialogVisible"
      :append-to-body="true"
      width="30%"
      top="40px"
      :before-close="dismissClassHandleClose"
    >
      <template v-if="NewAccountCode === '2'">
        <p>
          是否转让班级给 "<b>{{
            newClassTeacher.fullName
              ? newClassTeacher.userName + "(" + newClassTeacher.fullName + ")"
              : newClassTeacher.userName
          }}</b
          >"？
        </p>
      </template>
      <template v-else>
        <p>
          是否解散班级 "<b>{{ ClassOfAll.currentClass.className }}</b
          >"？
        </p>
        <p>解散后,成员将被移除班级,班级将被删除。</p>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitDismiss">
          确认
        </el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>

<script>
import {
  putUpdateClassName,
  DELETEclass,
  putCopyToNewClass,
  putTransferClassTeacher
} from "@/api/class";
import AddMember from "./AddMember";

export default {
  name: "SettingClass",
  props: ["settingClassVisible", "ClassOfAll"],

  components: { AddMember },
  data() {
    let checkClassName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("班级名称不能为空"));
      } else {
        callback();
      }
    };
    return {
      newAccountDialogVisible: false, // 新建学生账户
      NewAccountCode: "0", // '0'-创建账户 '1' 机构中添加 '2' 转让班主任
      updateNameDialogVisible: false, // 修改班级名称
      transferClassTeacherVisible: false, // 转让班主任 弹窗
      dimissClassDialogVisible: false, // 确定解散
      newClassNameForm: {
        className: ""
      },
      newClassNameFormRules: {
        className: [{ validator: checkClassName, trigger: "change" }]
      },
      //   从机构添加
      userIdList: "", // 接受机构所有成员添加的用户ID列表
      newClassTeacher: "" // 新班主任
    };
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit("close-setting-class");
    },
    newAccountBtn() {
      // 新学生账号添加
      this.newAccountDialogVisible = true;
      this.NewAccountCode = "0";
    },
    hasAccountBtn() {
      // 机构成员中添加
      this.newAccountDialogVisible = true;
      this.NewAccountCode = "1";
    },
    updateNameHandler() {
      this.newClassNameForm.className = this.ClassOfAll.currentClass.className;
      this.updateNameDialogVisible = true;
    },
    TransferClassTeacherHandler() {
      console.log("转让班主任");
      console.log(this.ClassOfAll.currentClass.classId);
      this.NewAccountCode = "2";
      this.transferClassTeacherVisible = true;
    },
    updateClassHandleClose(done) {
      // before-close
      done();
    },
    dismissClassHandleClose(done) {
      // before-close
      done();
    },
    deleteClassBtn() {
      // 解散班级按钮,
      console.log("解散班级", this.ClassOfAll.currentClass.classId);
      this.dimissClassDialogVisible = true; // 确认解散弹出
    },
    getChooseMemberUserIdList(list) {
      // 获取机构所有成员添加的userIdList
      this.userIdList = list;
    },
    getNewTeacherInfo(val) {
      // 获取新班主任信息
      this.newClassTeacher = val;
      console.log("获取新班主任信息", val);
    },
    async submitNewAccount() {
      // 0-创建新学生账号 1-从机构添加  2-转让班主任
      if (this.NewAccountCode === "0") {
        // 创建新学生账号
        // 触发子级 表单 'commitAddNewAccount' 提交
        this.$refs.commitAddNewAccount.submitForm("newAccountForm");
      }
      if (this.NewAccountCode === "1") {
        console.log("submitNewAccount==从机构添加");
        console.log(this.userIdList);
        // 提交PUT
        let obj = {
          fromClassId: this.ClassOfAll.currentClass.classId,
          toClassId: this.ClassOfAll.currentClass.classId,
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
          this.newAccountDialogVisible = false;

          // 回流
          this.$emit("reload", this.ClassOfAll.currentClass.classId);
        }
        if (res.error) {
          this.$message({
            message: res.error.message,
            type: "error"
          });
        }
      }
      if (this.NewAccountCode === "2") {
        // 转让班主任
        console.log("转让班主任");
        this.dimissClassDialogVisible = true;
      }
    },
    submitForm(formName) {
      // 修改班级名称
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.newClassNameForm.classId = this.ClassOfAll.currentClass.classId;
          const res = await putUpdateClassName(
            this.ClassOfAll.currentClass.classId,
            this.newClassNameForm.className
          );
          console.log(this.newClassNameForm);
          console.log("更改班级名称", res);

          if (res.success) {
            console.log(res);
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.$emit("reload", this.ClassOfAll.currentClass.classId);
            this.resetForm("newClassNameForm");
            this.updateNameDialogVisible = false;

            this.handleClose();
          }
          if (res.error) {
            this.$message.error(res.error.message);
          }
          this.$refs.newClassNameForm.clearValidate();
          console.log(this.newClassNameForm);
          console.log(this.newClassNameForm.className);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async submitDismiss() {
      // 解散班级
      let res = "";
      if (this.NewAccountCode === "1") {
        res = await DELETEclass({
          classId: this.ClassOfAll.currentClass.classId
        });
        console.log("解散班级", res);
      }
      if (this.NewAccountCode === "2") {
        // 转让班主任
        let obj = {
          classId: this.ClassOfAll.currentClass.classId,
          userId: this.newClassTeacher.userId
        };
        console.log("put===", obj);
        res = await putTransferClassTeacher(obj);
      }

      if (res.success) {
        this.$message({
          message: this.NewAccountCode === "1" ? "解散成功!" : "转让成功!",
          type: "success"
        });
        this.$emit("reload");
        this.dimissClassDialogVisible = false;
        this.transferClassTeacherVisible = false;

        this.handleClose();
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel() {
      // 统一关闭弹窗
      this.newAccountDialogVisible = false;
      this.updateNameDialogVisible = false;
      this.dimissClassDialogVisible = false;
      this.transferClassTeacherVisible = false;
    }
  }
};
</script>

<style></style>
