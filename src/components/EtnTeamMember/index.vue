<template>
  <el-row>
    <el-row :gutter="10" type="flex" justify="space-around">
      <el-col :md="4">
        <el-select v-model="selected" @change="handleFilterCategory">
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.type"
            :value="item.value"
          />
        </el-select>
      </el-col>

      <el-col :md="12">
        <el-input
          v-model="keyword"
          placeholder="请输入用户名/姓名"
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <el-col :md="8">
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
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import { getTeamOfMemberList } from "@/api/class";

export default {
  name: "EtnTeamMember",
  props: {
    // classId: {
    //   type: Number,
    //   default: ""
    // },
    // type: {
    //   type: Number,
    //   default: 0
    // }
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  components: { Pagination },
  data() {
    return {
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
        classId: 0, //this.classId,
        type: 0, //this.type, //0, //0=全部 1=学生 2=非学生
        keyword: "",
        pageSize: 8,
        pageIndex: 1
      },
      total: 0,
      multipleSelectionAll: [] // 所有选中的数据包含跨页数据
    };
  },
  created() {
    this.getList();
  },
  watch: {
    keyword(n, o) {
      if (n === "") {
        this.initPage();
        this.getList();
      }
    }
  },
  methods: {
    getRowKeys(row) {
      return row.userId;
    },
    initPage() {
      this.listQuery = {
        classId: 0, //this.currentClass.classId,
        keyword: "",
        pageSize: 8,
        pageIndex: 1
      };
      console.log(this.selected);
      this.listQuery.type = this.selected;
    },
    async getList() {
      this.listLoading = true;
      const res = await getTeamOfMemberList(this.listQuery);
      console.log(res.result);
      if (res.success) {
        this.memberList = res.result.memberList;
        this.total = res.result.totalCount;
        this.listLoading = false;
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    handleFilterCategory() {
      // 筛选成员
      this.listQuery.type = this.selected;
      this.getList();
    },
    handleFilter() {
      // 关键词搜索
      this.listQuery.keyword = this.keyword;
      this.listQuery.type = this.selected;
      this.getList();
    },
    handleSelectionChange(selection) {
      this.multipleSelectionAll = selection;
      this.multipleSelectionAll = this.multipleSelectionAll.map(i => i.userId);
      console.log(this.multipleSelectionAll);
      this.$emit("chooseMemberUserIdList", this.multipleSelectionAll);
    }
  }
};
</script>

<style></style>
