<template>
  <div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'fullName', order: 'ascending' }"
    >
      <el-table-column
        label="选择班级"
        min-width="140px"
        align="left"
        header-align="left"
      >
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.className"
            v-model="templateRadio"
            @change.native="getTemplateRow(scope.$index, scope.row)"
            style="margin-left: 10px;"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="classSize"
        label="人数"
        sortable
        align="center"
        min-width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-col>{{ row.classSize }}</el-col>
        </template>
      </el-table-column>

      <el-table-column
        label="班主任"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-col>{{ row.classTeacherName }}</el-col>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getClassroomList } from "@/api/class";

export default {
  name: "ToNewClass",
  props: ["currentMember"],
  components: {},
  created() {
    this.getList();
  },
  data() {
    return {
      loading: false,
      list: [],
      listQuery: {
        keyword: "",
        pageIndex: 1,
        pageSize: 20
      },
      templateRadio: true // 单选框默认为空,
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const res = await getClassroomList(this.listQuery);
      if (res.success) {
        console.log("获取班级列表", res);
        this.list = res.result.classroomList;
        this.loading = false;
      }
      if (res.error) {
        this.$message({
          type: "error",
          message: res.error.message
        });
      }
    },
    getTemplateRow(index, row) {
      // console.log(index, row);
      console.log(index, row.classId, row.className);
      this.$emit("chooseClassInfo", row);
      console.log(this.currentMember);
    }
  }
};
</script>

<style></style>
