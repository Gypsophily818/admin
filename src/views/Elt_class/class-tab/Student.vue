<template>
  <div>
    <el-row :gutter="20" style="margin-bottom:5px" type="flex" align="middle">
      <el-col :span="12">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名/姓名"
          style="width: 150px;margin:5px;margin-left:0"
          class="filter-item"
          size="small"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          style="margin-left:5px"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-col>

      <el-col :span="12" v-if="currentClass.isClassTeacher">
        <el-row
          type="flex"
          justify="end"
          style="margin:10px 0;text-align:center"
          :gutter="10"
        >
          <el-row>
            <el-tooltip
              class="item"
              effect="dark"
              content="原班级不删除,复制到另一班级"
              placement="top-start"
            >
              <el-tag type="info"><i class="el-icon-info">复制</i> </el-tag>
            </el-tooltip>
          </el-row>

          <!-- 学生管理提示 -->
          <el-row style="margin:0 5px">
            <el-tooltip
              class="item"
              effect="dark"
              content="原班级成员不删除,转移到另一班级"
              placement="top-start"
            >
              <el-tag type="info">
                <i class="el-icon-info">移动</i>
              </el-tag>
            </el-tooltip>
          </el-row>

          <el-row>
            <el-tooltip
              class="item"
              effect="dark"
              content="从原班级移除"
              placement="top-start"
            >
              <el-tag type="info">
                <i class="el-icon-info">移除</i>
              </el-tag>
            </el-tooltip>
          </el-row>
        </el-row>
      </el-col>
    </el-row>

    <el-row
      type="flex"
      justify="end"
      style="margin-bottom:8px"
      v-if="userIdList.length >= 2"
    >
      <el-button type="primary" plain size="mini" @click="copyToNewClass">
        批量复制
      </el-button>

      <el-button type="success" plain size="mini" @click="moveToNewClass">
        批量移动
      </el-button>

      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="removeMember"
      >
        批量移除
      </el-button>
    </el-row>

    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="memberList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'fullName', order: 'ascending' }"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <el-table-column width="40px" sortable type="index" align="center">
      </el-table-column>

      <el-table-column
        prop="fullName"
        align="left"
        label="学生"
        min-width="250"
        element-loading-text="请给我点时间！"
        sortable
      >
        <template slot-scope="{ row }">
          <el-row type="flex" align="middle">
            <el-row style="margin:0 10px">
              <el-avatar
                size="medium"
                :src="baseURL + row.avatar_Middle"
              ></el-avatar>
            </el-row>

            <template v-if="isEdit === row.userId">
              <el-row :gutter="20">
                <el-col>
                  <el-input
                    v-model="changeValue"
                    class="edit-input"
                    size="mini"
                  />
                </el-col>
              </el-row>
            </template>
            <span
              style="flex:1;margin-left:5px"
              v-else
              class="link-type"
              @click="personalIndex(row)"
              >{{
                row.fullName
                  ? row.userName + "(" + row.fullName + ")"
                  : row.userName
              }}</span
            >
          </el-row>
        </template>
      </el-table-column>

      <!-- 班主任 -->
      <template v-if="currentClass.isClassTeacher">
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          min-width="400"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <template>
              <el-button
                v-if="isEdit === row.userId"
                type="success"
                icon="el-icon-check"
                size="mini"
                @click="confirmNameEdit(row)"
              >
                Ok
              </el-button>

              <el-button
                v-else
                type="primary"
                icon="el-icon-edit"
                plain
                size="mini"
                @click="changeName(row)"
              >
                修改昵称
              </el-button>
            </template>

            <el-button
              type="primary"
              plain
              size="mini"
              @click="copyToNewClass(row)"
            >
              复制
            </el-button>

            <el-button
              type="success"
              plain
              size="mini"
              @click="moveToNewClass(row)"
            >
              移动
            </el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeMember(row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55"
          v-if="currentClass.isClassTeacher"
        >
        </el-table-column>
      </template>

      <!-- 不是班主任 -->
      <template v-else>
        <el-table-column
          label="操作"
          align="center"
          min-width="400"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <template>
              <el-button
                type="primary"
                icon="el-icon-s-order"
                size="mini"
                @click="changeName(row)"
              >
                日分析报表
              </el-button>
            </template>

            <el-button
              type="warning"
              icon="el-icon-s-marketing"
              size="mini"
              @click="copyToNewClass(row)"
            >
              周分析报表
            </el-button>

            <el-button
              type="success"
              icon="el-icon-s-data"
              size="mini"
              @click="moveToNewClass(row)"
            >
              月分析报表
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 复制/转移 到新班级 -->
    <el-dialog
      v-if="ToNewclassDView"
      :title="
        currentMember
          ? `将&quot;${currentMember.fullName}&quot;${
              confirmText === 'copy' ? '复制' : '移动'
            }到?`
          : `将${userIdList.length}名成员${
              confirmText === 'copy' ? '复制' : '移动'
            }到?`
      "
      :visible.sync="ToNewclassDView"
      width="60%"
      top="40px"
      :before-close="handleClose"
    >
      <ToNewClass
        :currentMember="currentMember"
        ref="chooseClass"
        @chooseClassInfo="getChooseClassInfo"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="ToNewclassDView = false">取 消</el-button>
        <el-button type="primary" @click="commitAgain">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认--弹窗 -->
    <el-dialog
      title="提示"
      top="40px"
      :visible.sync="confirmDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <!-- 移除 -->
      <template v-if="confirmText === 'remove'">
        <!-- 单项 -->
        <template v-if="currentMember">
          是否
          <el-tag effect="dark" type="danger"> 移除 </el-tag> 成员：
          <h3>
            <b>{{ removeInfo.userName + "(" + removeInfo.fullName + ")" }}</b>
          </h3>
        </template>
        <!-- 批量 -->
        <template v-else>
          确认 <el-tag effect="dark" type="danger"> 移除 </el-tag> 选中的
          <span>{{ userIdList.length }}名成员？</span>
        </template>
      </template>

      <!-- 复制 -->
      <template v-if="confirmText === 'copy'">
        <!-- 单选 -->
        <template v-if="currentMember">
          是否
          <el-tag effect="dark" type="primary">
            复制
          </el-tag>
          <span>&nbsp;"{{ currentMember.fullName }}"</span> 到： "{{
            currentChooseClass.className
          }}"
        </template>
        <!-- 批量 -->
        <template v-else>
          <p>{{ userIdList.length }}名成员</p>
          是否
          <el-tag effect="dark" type="primary"> 复制 </el-tag> 到：<span
            >"{{ currentChooseClass.className }}"</span
          >
        </template>

        <p>复制成功后,学生可参与新班级，原班级不变动</p>
      </template>

      <!-- 转移 -->
      <template v-if="confirmText === 'transfer'">
        <!-- 单选 -->
        <template v-if="currentMember">
          {{ currentMember.fullName }}
        </template>
        <!-- 批量 -->
        <template v-else>
          <p>{{ userIdList.length }}名成员</p>
        </template>
        是否
        <el-tag effect="dark" type="success"> 移动 </el-tag> 到：<span
          >"{{ currentChooseClass.className }}"</span
        >
        <p>转移成功后,学生将从原班级移除</p>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRemove">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击成员姓名打开 成员首页抽屉 -->
    <setting-personal
      :settingPersonalVisible="settingPersonalVisible"
      :personalInfo="personalData"
      :currentClass="currentClass"
      :classInfo="classInfo"
      @reload="reloadPage"
      @close-setting-drawer="settingPersonalVisible = false"
    />
  </div>
</template>

<script>
import {
  getClassInfo,
  getMemberList,
  putUpdateMemberName,
  DELETEmember,
  putCopyToNewClass,
  putMoveToNewClass
} from "@/api/class";
import { mapGetters } from "vuex";
import ToNewClass from "../components/ToNewClass";
import SettingPersonal from "../components/SettingPersonal";
export default {
  name: "Student",
  props: ["classId", "classList", "currentClass"],
  components: {
    ToNewClass,
    SettingPersonal
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "danger",
        2: "danger",
        3: "info",
        4: "success",
        5: "danger",
        6: "",
        7: "",
        8: "warning",
        9: ""
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      classInfo: null,
      memberList: [],
      listQuery: {
        classId: this.classId,
        type: 0,
        keyword: ""
      },
      total: 0,
      loading: false,
      searchKeyword: "",
      settingPersonalVisible: false, // 成员首页抽屉
      personalData: "", //成员首页信息
      selectList: [],
      isEdit: false,
      changeValue: "",
      confirmDialogVisible: false, //移除弹窗
      removeInfo: "",
      confirmText: "", // 确认信息选择框 remove-移除 transfer-转移 copy-复制
      ToNewclassDView: false, //（复制/转移）到新班级
      currentMember: "", //当前编辑成员
      currentChooseClass: "", //当前选择班级
      userIdList: [] // 选择的用户列表
    };
  },
  created() {
    this.getList();
  },
  watch: {
    searchKeyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    },
    classId(n, o) {
      console.log("student==classId更新", n);
      this.classId = n;
      this.listQuery.classId = n;
      this.getList(this.listQuery);
    }
  },
  methods: {
    initListQuery() {
      this.listQuery.keyword = "";
    },
    async getList() {
      this.loading = true;
      const info = await getClassInfo({ classId: this.classId });
      const memberList = await getMemberList(this.listQuery);
      if (info.success || memberList.success) {
        // console.log("classInfo===获取班级信息", info.result);
        console.log("memberList===student班级成员列表", memberList.result);
        this.classInfo = info.result;
        this.memberList = memberList.result.members;
        this.loading = false;
        this.$emit("studentCount", this.memberList.length);
      }

      if (info.error || memberList.error) {
        this.$message.error(info.error.message);
      }
    },
    clickTabHandler(tab, event) {
      console.log(tab, event);
      console.log(tab.label);
      if (tab.label == "学生管理") {
        this.studentManage();
      } else {
        this.teacherManage();
      }
    },
    teacherManage() {
      console.log("学生管理");
      this.listQuery.type = 1;
      this.getList();
    },
    studentManage() {
      console.log("教师管理");
      this.listQuery.type = 0;
      this.$nextTick(() => {
        this.getList();
      });
    },
    handleFilter() {
      this.listQuery.keyword = this.searchKeyword;
      this.getList();
    },
    personalIndex(row) {
      console.log("打开成员首页抽屉", this.classInfo);
      console.log("成员", row);
      this.personalData = row;
      this.settingPersonalVisible = true;
    },
    tableRowClassName({ row, rowIndex }) {
      let that = this;
      for (let i = 0; i < that.selectList.length; i++) {
        if (row === that.selectList[i]) {
          return "warning-row";
        }
      }
    },
    handleSelectionChange(selection) {
      // console.log(selection);
      this.userIdList = selection.map(i => {
        return i.userId;
      });
      console.log(this.userIdList);
      // 获取选择项，突出勾选后颜色
      this.selectList = selection;
    },
    changeName(row) {
      console.log(row);
      this.changeValue = row.fullName; //获取当前昵称
      this.isEdit = row.userId; //进入编辑状态
    },
    async confirmNameEdit(row) {
      console.log(row.userId, this.classInfo.classId, this.changeValue);

      this.isEdit = false; //关闭可编辑状态

      // 提交修改
      const res = await putUpdateMemberName(
        this.classInfo.classId,
        row.userId,
        this.changeValue
      );
      if (res.success) {
        console.log(res);
        this.$message({
          message: "修改成功~",
          type: "success"
        });
        // this.$emit("reload", this.classInfo.classId);
        // 回流
        this.getList();
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    copyToNewClass(row) {
      if (this.userIdList.length >= 2) {
        // 批量复制
        this.currentMember = "";
        console.log("批量复制userIdList", this.userIdList);
      } else {
        // 单项
        this.currentMember = row;
        console.log("单项复制", row);
      }
      this.confirmText = "copy"; // 确认弹出框为 copy
      this.ToNewclassDView = true;
    },
    moveToNewClass(row) {
      if (this.userIdList.length >= 2) {
        // 批量移动
        this.currentMember = "";
        console.log("批量转移userIdList", this.userIdList);
      } else {
        // 单项
        this.currentMember = row;
        console.log("单项转移", row);
      }
      this.confirmText = "transfer"; // 确认弹出框为 transfer
      this.ToNewclassDView = true;
    },
    removeMember(row) {
      if (this.userIdList.length >= 2) {
        // 批量移动
        this.currentMember = "";
        console.log("批量移除userIdList", this.userIdList);
      } else {
        // 单项
        this.currentMember = row;
        console.log("单项移除", row);
      }
      this.confirmDialogVisible = true;
      this.confirmText = "remove";
      this.removeInfo = row;
    },
    handleClose(done) {
      done();
    },
    commitRemove() {
      if (this.confirmText === "remove") {
        this.isRemoveText();
      }
      if (this.confirmText === "copy") {
        this.isCopy();
      }
      if (this.confirmText === "transfer") {
        this.isTransfer();
      }
    },
    async isRemoveText() {
      if (this.userIdList.length >= 2) {
        // 批量
        console.log("批量", this.userIdList);
        this.userIdList = this.userIdList; // 删除成员列表
      } else {
        // 单项
        console.log("单项", this.currentMember);
        this.userIdList.push(this.removeInfo.userId); // 删除单个成员
      }
      console.log(this.userIdList);

      const res = await DELETEmember({
        classId: this.classInfo.classId,
        userIdList: this.userIdList
      });
      console.log("移除成员==", res);
      if (res.success) {
        this.$message({
          message: "移除成功~",
          type: "success"
        });
        this.userIdList = [];
        this.confirmDialogVisible = false;
        // 回流
        this.getList();
        this.$emit("reload", this.classInfo.classId);
      }
      if (res.error) {
        this.$message({
          message: res.error.message,
          type: "error"
        });
      }
    },
    async isCopy() {
      // 复制到班级
      console.log("fromClassId", this.classInfo.classId);
      console.log("toClassId", this.currentChooseClass.classId);

      if (this.userIdList.length >= 2) {
        // 批量
        console.log("isCopy==userIdList批量复制", this.userIdList);
        this.userIdList = this.userIdList; // 复制成员列表
      } else {
        // 单项
        console.log("单项复制", this.currentMember);
        this.userIdList.push(this.currentMember.userId); // 复制单个成员
      }
      // 提交PUT
      let obj = {
        fromClassId: this.classInfo.classId,
        toClassId: this.currentChooseClass.classId,
        userIdList: this.userIdList
      };
      console.log(obj);
      const res = await putCopyToNewClass(obj);
      console.log(res);
      if (res.success) {
        this.$message({
          message: "复制成功~",
          type: "success"
        });
        this.userIdList = [];
        this.confirmDialogVisible = false;
      }
      if (res.error) {
        this.$message({
          message: res.error.message,
          type: "error"
        });
      }
    },
    async isTransfer() {
      //转移
      if (this.userIdList.length >= 2) {
        // 批量
        console.log("批量", this.userIdList);
        this.userIdList = this.userIdList; // 删除成员列表
      } else {
        // 单项
        console.log("单项", this.currentMember);
        this.userIdList.push(this.currentMember.userId); // 删除单个成员
      }
      // 提交PUT
      let obj = {
        fromClassId: this.classInfo.classId,
        toClassId: this.currentChooseClass.classId,
        userIdList: this.userIdList
      };
      console.log(obj);
      const res = await putMoveToNewClass(obj);
      console.log(res);
      if (res.success) {
        this.$message({
          message: "转移成功~",
          type: "success"
        });
        this.userIdList = [];
        this.confirmDialogVisible = false;
        // 回流
        this.getList();
      }
      if (res.error) {
        this.$message({
          message: res.error.message,
          type: "error"
        });
      }
    },
    getChooseClassInfo(row) {
      // 获取子级弹窗选择的班级
      console.log("getChooseClassInfo", row);
      this.currentChooseClass = row;
    },
    commitAgain() {
      // this.$refs
      console.log("确定");
      this.ToNewclassDView = false;
      // 弹出确认框，以防按错
      this.confirmDialogVisible = true;
    },
    reloadPage() {
      this.getList();
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: rgb(207, 226, 190);
}
</style>
