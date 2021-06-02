<template>
  <el-card class="info-card" style="margin-bottom:20px;" shadow="hover">
    <!-- v-if="classInfo" -->
    <div slot="header" class="clearfix" style="position:relative;">
      <el-badge
        v-if="ClassOfAll.currentClass.pendingJoinCount > 0"
        style="position:absolute;top:0;right:0"
        :value="ClassOfAll.currentClass.pendingJoinCount"
        type="danger"
        class="item-watting"
      >
        <el-button
          icon="el-icon-time"
          type="warning"
          size="small"
          @click="verifyJoinBtn"
          >待审核</el-button
        >
      </el-badge>

      <el-row>
        <h3 style="margin:0 0 10px 0">
          {{ ClassOfAll.currentClass.className }}
        </h3>
      </el-row>
      <el-row type="flex" align="middle">
        <span>
          班主任:
        </span>
        <el-avatar
          style="margin:0 8px"
          :src="baseURL + ClassOfAll.currentClass.classTeacherAvatar_Middle"
        ></el-avatar>
        <span>{{ ClassOfAll.currentClass.classTeacherName }}</span>
      </el-row>
    </div>

    <div>
      <div class="box-center">
        <!-- 基于PanThumb -->
        <!-- <class-info-box
          :height="'80px'"
          :width="'80px'"
          :image="baseURL + ClassOfAll.currentClass.classTeacherAvatar_Middle"
          :hoverable="false"
        >
        </class-info-box> -->
        <!-- {{ ClassOfAll.currentClass }} -->
        <el-row>
          <svg-icon icon-class="user" />
          班级人数:
          <count-to
            :start-val="0"
            :end-val="ClassOfAll.currentClass.classSize"
            :duration="2000"
            class="card-panel-num"
          />
          <!-- {{ ClassOfAll.currentClass.classSize }} -->
        </el-row>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <!-- <div class="user-bio-section-header">
          <svg-icon icon-class="user" />
        </div> -->

        <div class="user-bio-section-body">
          <div class="text-muted">
            <!-- 创建新学生账号 -->
            <el-row
              style="margin-bottom:10px"
              v-if="ClassOfAll.currentClass.isClassTeacher"
            >
              <el-row type="flex" justify="center">
                <el-button
                  class="pan-btn blue-btn"
                  style="margin-top:5px"
                  icon="el-icon-plus"
                  @click="newAccountHandler"
                >
                  创建新学生账号
                </el-button>
              </el-row>

              <el-row type="flex" justify="center">
                <el-button
                  class="pan-btn blue-btn"
                  style="margin-top:5px"
                  icon="el-icon-plus"
                  @click="hasAccountHandler"
                >
                  从机构所有成员
                </el-button>
              </el-row>
            </el-row>

            <el-row type="flex" align="midldle">
              <el-button
                v-if="ClassOfAll.currentClass.isClassTeacher"
                style="width:100%"
                class="pan-btn tiffany-btn"
                @click="openSetting"
              >
                班级设置
              </el-button>
              <el-button
                v-else
                plain
                type="danger"
                style="width:100%"
                @click="quitClassBtn"
                >退出本班</el-button
              >
            </el-row>
            <!-- <el-row>
              <el-button
                class="pan-btn blue-btn"
                style="margin-top:5px"
                icon="el-icon-plus"
                @click="testBtn"
              >
                测试按钮
              </el-button>
            </el-row> -->

            <!-- 班级设置抽屉 -->
            <setting-class
              :settingClassVisible="settingClassVisible"
              :ClassOfAll="ClassOfAll"
              @reload="successSetting"
              @close-setting-class="settingClassVisible = false"
            />
          </div>
        </div>

        <!--  添加成员弹窗 -->
        <el-dialog
          v-if="newAccountDialogVisible"
          :title="
            NewAccountCode === '0' ? '创建新学生账号' : '从机构所有成员添加'
          "
          :visible.sync="newAccountDialogVisible"
          :append-to-body="true"
          top="40px"
          :width="NewAccountCode === '0' ? '40%' : '50%'"
        >
          <add-member
            :currentClass="ClassOfAll.currentClass"
            ref="commitAddNewAccount"
            :NewAccountCode="NewAccountCode"
            @chooseMemberUserIdList="getChooseMemberUserIdList"
          />

          <span slot="footer" class="dialog-footer">
            <el-button @click="newAccountDialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="submitNewAccount"
              >确认添加</el-button
            >
          </span>
        </el-dialog>

        <!-- 退出班级弹窗 -->
        <el-dialog title="提示" :visible.sync="quitClassVisible" width="30%">
          <!-- :before-close="handleClose" -->
          <span>是否退出班级"{{ ClassOfAll.currentClass.className }}"?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="quitClassVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitQuitClass">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 审核处理 -->
        <el-dialog
          v-if="verifyJoinVisible"
          title="新的申请"
          :visible.sync="verifyJoinVisible"
          width="45%"
        >
          <div>
            <el-card
              class="box-card"
              v-for="(item, index) in verifyJoinList"
              :key="index"
            >
              <el-row type="flex" :gutter="10">
                <el-avatar
                  shape="square"
                  :src="baseURL + item.avatar_Middle"
                ></el-avatar>

                <el-col :span="10">
                  <span>
                    {{
                      item.fullName
                        ? item.userName + "(" + item.fullName + ")"
                        : item.userName
                    }}
                  </span>
                  <el-row type="flex" align="bottom">
                    <el-tag
                      size="mini"
                      :type="item.userType === 3 ? '' : 'danger'"
                      effect="dark"
                    >
                      {{ item.userTypeName }}
                    </el-tag>
                    <span>申请加入班级</span>
                  </el-row>
                </el-col>
                <el-col
                  :span="12"
                  v-if="ClassOfAll.currentClass.isClassTeacher"
                >
                  <el-row type="flex" justify="end">
                    <!-- 审核;[0=Ignore(忽略)],[1=Reject(拒绝)],[2=Agree(同意)] -->
                    <el-button
                      size="mini"
                      type="success"
                      plain
                      @click="verifyBtnHandler(item.indexId, 2)"
                      >同意</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      plain
                      @click="verifyBtnHandler(item.indexId, 1)"
                      >拒绝</el-button
                    >
                    <el-button
                      size="mini"
                      type="info"
                      plain
                      @click="verifyBtnHandler(item.indexId, 0)"
                      >忽略</el-button
                    >
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="verifyJoinVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitQuitClass">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </el-card>
</template>

<script>
import ClassInfoBox from "../components/ClassInfoBox";
import SettingClass from "../components/SettingClass";
import AddMember from "../components/AddMember";
import CountTo from "vue-count-to";

import {
  quitCurrentClass,
  getPendingJoinList,
  putVerifyJoin,
  putCopyToNewClass
} from "@/api/class";
import { mapGetters } from "vuex";

export default {
  components: { ClassInfoBox, SettingClass, AddMember ,CountTo},
  computed: {
    ...mapGetters(["baseURL"])
  },
  // props: ["classId", "classList", "classInfo", "currentClass"],
  props: ["ClassOfAll"],
  data() {
    return {
      settingClassVisible: false, // 班级设置抽屉
      quitClassVisible: false, // 退出本班弹窗
      verifyJoinVisible: false, // 待审核弹窗
      verifyJoinList: [], // 待审核成员列表
      newAccountDialogVisible: false, //添加新成员
      userIdList: "", // 接受机构所有成员添加的用户ID列表
      NewAccountCode: "0" // '0'-创建新账户 '1' 机构中添加
    };
  },
  created() {},
  methods: {
    async verifyJoinBtn() {
      const res = await getPendingJoinList({
        classId: this.ClassOfAll.currentClass.classId
      });
      console.log(res.result);
      if (res.success) {
        this.verifyJoinList = res.result.members;
      }
      if (res.error) {
        this.$message.error(res.result.error.message);
      }
      // console.log(this.ClassOfAll.currentClass.classId);
      this.verifyJoinVisible = true;
    },
    async verifyBtnHandler(indexId, code) {
      let obj = {
        indexId: indexId,
        verify: code
      };
      console.log(obj);
      const res = await putVerifyJoin(obj);
      if (res.success) {
        console.log("成功处理~", res.result);
        this.$message({
          message: "处理完成",
          type: "success"
        });
        this.$emit("reload", this.ClassOfAll.currentClass.classId);
        this.verifyJoinVisible = false;
      }

      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    getChooseMemberUserIdList(list) {
      // 获取机构所有成员添加的userIdList
      this.userIdList = list;
    },
    newAccountHandler() {
      // 新学生账号添加
      this.newAccountDialogVisible = true;
      this.NewAccountCode = "0";
    },
    hasAccountHandler() {
      // 机构成员中添加
      this.newAccountDialogVisible = true;
      this.NewAccountCode = "1";
    },
    openSetting() {
      console.log("打开班级设置抽屉", this.ClassOfAll.currentClass);
      this.settingClassVisible = true;
    },
    successSetting(id) {
      console.log("更改成功===class-card", id);
      this.$emit("reload", id || "");
    },
    quitClassBtn() {
      // 打开确认弹窗
      this.quitClassVisible = true;
    },
    testBtn() {
      const { NewAccountCode } = this;
      console.log(NewAccountCode);
      console.log(this);
    },
    async submitNewAccount() {
      // 0-创建新学生账号 1-从机构添加  2-转让班主任
      if (this.NewAccountCode === "0") {
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
    },
    async submitQuitClass() {
      console.log(this.classInfo.classId);
      const res = await quitCurrentClass({ classId: this.classInfo.classId });

      if (res.success) {
        console.log("退出成功", res.result);
        this.$message({
          message: "退出成功!",
          type: "success"
        });
        this.quitClassVisible = false;
      }

      if (res.error) {
        this.$message.error(res.error.message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.info-card {
  .item-watting {
    z-index: 3;
    &:hover {
      cursor: pointer;
    }
  }
}
.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
