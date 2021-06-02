<template>
  <div>
    <!-- 新建账号 -->
    <el-row v-if="NewAccountCode === '0'" type="flex" justify="center">
      <el-col :span="20">
        <el-form
          :model="newAccountForm"
          :rules="rules"
          ref="newAccountForm"
          label-width="auto"
          class="demo-newAccountForm"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="newAccountForm.userName"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="newAccountForm.password"
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="newAccountForm.name"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="newAccountForm.phoneNumber"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 机构所有成员添加 -->
    <el-row
      v-if="NewAccountCode === '1'"
      style="margin-left:10px;margin-top:-20px"
    >
      <el-row>
        <el-col :md="8">
          <el-select v-model="selected" @change="handleFilterCategory">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.type"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top:10px">
        <el-col :sm="14" :md="12">
          <el-input
            v-model="keyword"
            placeholder="请输入用户名/姓名"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :sm="6" :md="6">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>

      <!-- <el-table-column -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="memberList"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%;margin-top:15px"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          width="50px"
          sortable
          type="index"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="全选"
          type="selection"
          :reserve-selection="true"
          width="55"
        >
        </el-table-column>

        <el-table-column
          label="成员信息"
          prop="testPaperName"
          align="left"
          min-width="160"
        >
          <template slot-scope="{ row }">
            <el-row type="flex" align="middle">
              <el-avatar :src="baseURL + row.avatar_Middle"></el-avatar>

              <span class="" style="margin-left:5px">{{
                row.fullName
                  ? row.userName + "(" + row.fullName + ")"
                  : row.userName
              }}</span>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageIndex"
        :limit.sync="listQuery.pageSize"
        :page-sizes="[8, 20, 30, 50]"
        @pagination="getList"
        small
      />
    </el-row>

    <!-- 转让班主任 -->
    <el-row
      v-if="NewAccountCode === '2'"
      style="margin-left:10px;margin-top:-20px"
    >
      <el-row :gutter="10" style="margin-top:10px">
        <el-col :sm="14" :md="12">
          <el-input
            v-model="keyword"
            placeholder="请输入用户名/姓名"
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <el-col :sm="6" :md="6">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
      </el-row>

      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="memberList"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%;margin-top:15px"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          width="70px"
          sortable
          type="index"
          align="left"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.$index + 1"
              v-model="templateRadio"
              @change.native="getTemplateRow(scope.$index, scope.row)"
              style="margin-left: 10px;"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>

        <el-table-column
          label="成员信息"
          prop="testPaperName"
          align="left"
          min-width="160"
        >
          <template slot-scope="{ row }">
            <el-row type="flex" align="middle">
              <el-avatar :src="baseURL + row.avatar_Middle"></el-avatar>

              <span class="" style="margin-left:5px">{{
                row.fullName
                  ? row.userName + "(" + row.fullName + ")"
                  : row.userName
              }}</span>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageIndex"
        :limit.sync="listQuery.pageSize"
        :page-sizes="[8, 20, 30, 50]"
        @pagination="getList"
        small
      />
    </el-row>
  </div>
</template>

<script>
import {
  postCreateStudent,
  getMemberList,
  getTeamOfMemberList
} from "@/api/class";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";

export default {
  name: "AddMember",
  props: ["currentClass", "NewAccountCode"],
  computed: {
    ...mapGetters(["baseURL"])
  },
  components: { Pagination },
  data() {
    return {
      // 新建学生账户
      newAccountForm: {
        userName: "",
        password: "",
        name: "",
        phoneNumber: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //   从机构添加
      memberList: [], // 表格数据
      listLoading: true,
      keyword: "",
      selected: 0, //筛选全部 学员 非学员(教员) 默认全部
      categoryList: [
        { value: 0, type: "全部" },
        { value: 1, type: "学员" },
        { value: 2, type: "教员" }
      ],
      listQuery: {
        classId: this.currentClass.classId,
        type: 0, //0=全部 1=学生 2=非学生
        keyword: "",
        pageSize: 8,
        pageIndex: 1
      },
      total: 0,
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      // 转让班主任
      templateRadio: true // 单选框默认空,
    };
  },
  created() {
    console.log("addMember--create");
    if (this.NewAccountCode !== "0") {
      console.log("NewAccountCode == 1 ==从机构添加");
      console.log("NewAccountCode == 2 ==转让班主任");
      this.getList();
    }
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
    initPage() {
      this.listQuery = {
        classId: this.currentClass.classId,
        keyword: "",
        pageSize: 8,
        pageIndex: 1
      };
      console.log(this.selected);
      this.listQuery.type = this.selected;
    },
    handleClose() {
      this.$emit("close-add-member");
    },
    getRowKeys(row) {
      // 分页多选时, 标识列表数据中每一行的唯一键的名称
      return row.userId;
    },
    async getList() {
      this.listLoading = true;
      if (this.NewAccountCode === "1") {
        // 从机构添加
        this.addMemberFromTeam();
      }
      if (this.NewAccountCode === "2") {
        // 转让班主任
        this.transferClassTeacher();
      }
    },
    async addMemberFromTeam() {
      const res = await getTeamOfMemberList(this.listQuery);
      console.log(res.result);
      console.log(res.result.memberList);
      if (res.success) {
        this.memberList = res.result.memberList;
        this.total = res.result.totalCount;
        this.listLoading = false;
      }
    },
    async transferClassTeacher() {
      let listQuery = {
        classId: this.currentClass.classId,
        type: 1,
        keyword: ""
      };
      const res = await getMemberList(listQuery);
      if (res.success) {
        console.log(res);
        this.memberList = res.result.members;
        // this.total = res.result.members.length;
        this.listLoading = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.newAccountForm.classId = this.currentClass.classId;

          console.log(this.newAccountForm);
          const res = await postCreateStudent(this.newAccountForm);
          console.log(res);
          if (res.success) {
            console.log(res);
            this.$message({
              message: "添加成功!",
              type: "success"
            });
            this.$router.push("/class/index");
            this.$emit("reload");
            this.resetForm("newAccountForm");
            this.handleClose();
          }
          if (res.error) {
            this.$message.error(res.error.message);
          }
          this.$refs.newAccountForm.clearValidate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 从机构添加------
    handleFilterCategory() {
      console.log("handleFilterCategory", this.selected);
      // 筛选成员
      this.listQuery.type = this.selected;
      this.getList();
    },
    handleFilter() {
      console.log("关键词搜索", this.keyword);
      // 关键词搜索
      this.listQuery.keyword = this.keyword;
      this.listQuery.type = this.selected;

      this.getList();
    },
    handleSelectionChange(selection) {
      console.log(selection);
      this.multipleSelectionAll = selection;
      this.multipleSelectionAll = this.multipleSelectionAll.map(i => i.userId);
      console.log(this.multipleSelectionAll);
      this.$emit("chooseMemberUserIdList", this.multipleSelectionAll);
    },
    getTemplateRow(index, row) {
      console.log(index, row.userId, row.userName);
      this.$emit("chooseTeacherInfo", row);
    }
  }
};
</script>

<style></style>
