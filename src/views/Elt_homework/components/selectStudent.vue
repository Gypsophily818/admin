<template>
  <el-dialog
    :visible.sync="dialogStuVisible"
    title="指定班级学生"
    :before-close="handleClose"
    width="40%"
    class="select-book"
    top="40px"
  >
    <el-row type="flex" align="middle" style="margin-top:-30px">
      <el-col :span="6">
        <el-input
          v-model.trim="keyword"
          placeholder="输入用户名或昵称"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <el-col :span="4">
        <el-row type="flex" align="middle">
          <el-button
            style="margin:0 8px"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
          <el-badge :value="hasSelectStudent.length">
            <el-tag>已选学生</el-tag>
          </el-badge>
        </el-row>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="studentList"
      v-loading="listLoading"
      height="500"
      sprite
      border
      highlight-current-row
      style="width: 100%; margin-top:10px"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        label="全选"
        width="100px"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="学生"
        prop="testPaperCount"
        align="left"
        min-width="200"
      >
        <template slot-scope="{ row }">
          <div>
            <template v-if="row.avatar_Middle">
              <div>
                <el-row type="flex" align="middle">
                  <el-avatar
                    :size="40"
                    :src="baseURL + row.avatar_Middle"
                  ></el-avatar>
                  <span style="margin-left:5px">
                    {{
                      row.fullName
                        ? row.fullName + "" + "(" + row.userName + ")"
                        : row.userName
                    }}
                  </span>
                </el-row>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column label="用户名" min-width="140px" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="手机号" min-width="140px" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    /> -->

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('select-student-close')"
        >取消</el-button
      >
      <el-button type="primary" @click="summitBtn">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getClassroomStuList } from "@/api/publish";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";

export default {
  props: ["dialogStuVisible", "classroomId", "hasSelectStudent"],
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  created() {
    this.getList();
  },
  watch: {
    keyword(n, o) {
      if (n == "") {
        console.log(n);
        this.initListQuery();
        this.getList();
      }
    }
  },
  data() {
    return {
      studentList: [],
      listLoading: true,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      selectStuArr: [],
      keyword: "",
      isSelectPaper: false
    };
  },
  methods: {
    // 初始化
    initListQuery() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10
      };
    },
    getRowKeys(row) {
      return row.userId;
    },
    handleFilter() {
      this.listQuery.keyword = this.keyword;
      console.log(this.keyword);
      this.getList(this.listQuery);
    },
    async getList() {
      // 获取学生列表
      this.listLoading = true;
      let obj = {
        classId: this.classroomId,
        keyword: this.keyword
      };
      const { result, success, error } = await getClassroomStuList(obj);
      console.log("获取学生列表", result);
      if (success) {
        let users = result.users;
        // console.log("users", users);
        // this.studentList = this.sliceList(users, 10)[
        //   this.listQuery.pageIndex - 1
        // ];
        // this.total = users.length;

        this.studentList = users;
        this.reserveShow();
      }
      if (error) {
        this.$message.error(error.message);
      }

      this.listLoading = false;
    },
    // 处理反显
    reserveShow() {
      // 初始化--是否已选择
      if (this.hasSelectStudent) {
        console.log("初始化--已选择", this.hasSelectStudent);
        // getList 获取的当前页所有学生  反显
        // this.toggleSelection(this.hasSelectStudent);
      }
    },
    handleSelectionChange(selections) {
      console.log(selections);
      // this.selectStuArr = selections.map(i => {
      //   return i.userId;
      // });
      // console.log(this.selectStuArr);
      // this.$emit("select-student", this.selectStuArr);
      // 更新选择
      this.$emit("select-student", selections);
    },
    toggleSelection(rows) {
      console.log("hasSelectStudent", this.hasSelectStudent);
      console.log(rows);
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleClose(done) {
      this.$emit("select-student-close");
      this.selectStuArr = [];
    },
    sliceList(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    summitBtn() {
      // 确定
      this.$emit("select-student-close", this.selectStuArr);
    },
    getHasSelectStuList() {
      return JSON.parse(localStorage.getItem("selectStuArr"));
    }
  }
};
</script>
<style lang="scss"></style>
