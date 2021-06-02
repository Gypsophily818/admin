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
        <!-- 教师管理提示 -->
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
              content="可复制到多个班级"
              placement="top-start"
            >
              <el-tag type="info"><i class="el-icon-info">复制</i> </el-tag>
            </el-tooltip>
          </el-row>

          <el-row style="margin:0 5px">
            <el-tooltip
              class="item"
              effect="dark"
              content="可转移到多个班级"
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
        label="教师"
        min-width="240"
        element-loading-text="请给我点时间！"
        sortable
      >
        <template slot-scope="{ row }">
          <el-row type="flex" align="middle" justify="end">
            <el-col :span="16">
              <el-row type="flex" align="middle">
                <el-avatar
                  size="medium"
                  :src="baseURL + row.avatar_Middle"
                ></el-avatar>

                <span style="margin-left:10px">{{
                  row.fullName
                    ? row.userName + "(" + row.fullName + ")"
                    : row.userName
                }}</span>
              </el-row>
            </el-col>

            <el-col :span="8">
              <el-row type="flex" justify="center">
                <el-tag
                  effect="dark"
                  v-if="row.userTypeName"
                  :type="row.userType | statusFilter"
                  >{{ row.userTypeName }}
                </el-tag>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        v-if="currentClass.isClassTeacher"
        label="操作"
        align="center"
        min-width="320"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
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
    </el-table>

    <!-- 移除成员弹窗 -->
    <!-- <el-dialog
      title="提示"
      top="40px"
      :visible.sync="removedialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      是否
      <el-tag effect="dark" type="danger"> 移除 </el-tag> 成员：
      <h3>
        <b>{{ removeInfo.userName + "(" + removeInfo.fullName + ")" }}</b>
      </h3>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCommit">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 复制/转移 到新班级 -->
    <el-dialog
      v-if="ToNewclassDView"
      :title="
        currentMember
          ? `将&quot;${
              currentMember.fullName
                ? currentMember.fullName
                : currentMember.userName
            }&quot;${confirmText === 'copy' ? '复制' : '移动'}到?`
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
            <b>{{
              removeInfo.fullName
                ? removeInfo.userName + "(" + removeInfo.fullName + ")"
                : removeInfo.userName
            }}</b>
            <!-- <b>{{ removeInfo.userName + "(" + removeInfo.fullName + ")" }}</b> -->
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
          <span
            >&nbsp;"{{
              currentMember.fullName
                ? currentMember.fullName
                : currentMember.userName
            }}"</span
          >
          到： "{{ currentChooseClass.className }}"
        </template>
        <!-- 批量 -->
        <template v-else>
          <p>{{ userIdList.length }}名成员</p>
          是否
          <el-tag effect="dark" type="primary"> 复制 </el-tag> 到：<span
            >"{{ currentChooseClass.className }}"</span
          >
        </template>

        <p>复制成功后,教师可参与新班级，原班级不变动</p>
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
        <p>转移成功后,教师将从原班级移除</p>
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitRemove">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getClassInfo,
  getMemberList,
  DELETEmember,
  putCopyToNewClass,
  putMoveToNewClass
} from "@/api/class";
import ToNewClass from "../components/ToNewClass";

export default {
  name: "Teacher",
  props: ["classId", "classList", "currentClass"],
  components: {
    ToNewClass
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
        type: 1,
        keyword: ""
      },
      total: 0,
      loading: false,
      searchKeyword: "",
      selectList: [],
      userIdDelList: [],
      removedialogVisible: false, // 移除框
      confirmDialogVisible: false, // 确认框
      removeInfo: "",
      userIdList: [], // 选择的用户列表
      confirmText: "", // 确认信息选择框 remove-移除 transfer-转移 copy-复制
      currentMember: "", //当前编辑成员
      currentChooseClass: "", //当前选择班级
      ToNewclassDView: false //（复制/转移）到新班级
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
      console.log("classId更新", n);
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
        this.classInfo = info.result;
        this.memberList = memberList.result.members;
        this.loading = false;
        this.$emit("teacherCount", this.memberList.length);
      }

      if (info.error || memberList.error) {
        this.$message.error(info.error.message);
      }
    },
    handleFilter() {
      this.listQuery.keyword = this.searchKeyword;
      this.getList();
    },
    addSuccessReload(id) {
      if (id) {
        this.$emit("reload", id);
      } else {
        this.$emit("reload");
      }
      this.getList();
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
      this.userIdList = selection.map(i => {
        return i.userId;
      });
      console.log(this.userIdList);
      // 获取选择项，突出勾选后颜色
      this.selectList = selection;
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
        this.$emit("reload", this.classInfo.classId);
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
        this.$emit("reload", this.classInfo.classId);
      }
      if (res.error) {
        this.$message({
          message: res.error.message,
          type: "error"
        });
      }
    },
    // async handleCommit() {
    //   this.userIdDelList.push(this.removeInfo.userId);

    //   const res = await DELETEmember({
    //     classId: this.classInfo.classId,
    //     userIdList: this.userIdDelList
    //   });
    //   console.log("移除成员==", res);
    //   if (res.success) {
    //     this.$message({
    //       message: "移除成功~",
    //       type: "success"
    //     });
    //     this.userIdDelList = [];
    //     this.removedialogVisible = false;
    //     this.$emit("reload", this.classInfo.classId);
    //   }
    //   if (res.error) {
    //     this.$message({
    //       message: res.error.message,
    //       type: "error"
    //     });
    //   }
    // },
    getChooseClassInfo(row) {
      // 获取子级弹窗选择的班级
      console.log("getChooseClassInfo", row);
      this.currentChooseClass = row;
    },
    commitAgain() {
      console.log("确定");
      this.ToNewclassDView = false;
      // 弹出确认框，以防按错
      this.confirmDialogVisible = true;
    }
  }
};
</script>

<style>
.el-table .warning-row {
  background: rgb(207, 226, 190);
}
</style>
