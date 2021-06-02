<template>
  <div class="tab-container">
    <el-select
      v-model="querySort"
      style="width: 140px;margin-bottom:5px"
      class="filter-item"
      @change="handleFilterDate"
    >
      <el-option
        v-for="(item, index) in answerTypeList"
        :key="index"
        :label="item.answerTypeName"
        :value="item.answerType"
      />
    </el-select>

    <!-- 搜索 -->
    <el-input
      v-model="keyword"
      placeholder="请输入搜索内容"
      style="width: 200px;margin-left:10px;margin-right:10px"
      class="filter-item"
      @keyup.enter.native="handleFilterSearch"
    />
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilterSearch"
    >
      搜索
    </el-button>

    <el-table
      ref="multipleTable"
      class="wrong-table"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="题干" prop="group" align="left" min-width="300">
        <template slot-scope="{ row }">
          <span @click="topicHandle(row)" class="wrong-topic link-type">
            <template v-if="row.group.content.length">
              {{ row.group.content[0].contentValue | decodeURI }}
            </template>
            <template v-else>
              暂无题干信息
            </template>
          </span>
        </template>
      </el-table-column>

      <!-- start-date -->
      <el-table-column
        label="题型"
        prop="answerTypeName"
        min-width="120px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div class="typename-wapper">
            <el-tag>
              {{ row.answerTypeName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- end-date -->
      <el-table-column
        label="评估类型"
        prop="questionType"
        min-width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag type="danger">
            {{ row.questionType }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- end-date -->
      <el-table-column
        label="答错次数"
        sortable
        prop="errorCount"
        min-width="108px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: #ff4949">{{ row.errorCount }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleDetail(row)">
            查看详情
          </el-button>
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
    />

    <!-- 查看详情 （错题本 错题详情）-->
    <el-dialog
      class="wrong-dialog"
      v-if="wrongDialogVisible"
      top="40px"
      title="错题详情"
      :visible.sync="wrongDialogVisible"
      width="50%"
      @close="handlerClosewrongDialog"
    >
      <!-- 错题详情 -->
      <etn-wrong-detail :details="wrongDetail" />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="wrongDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 题干详情 -->
    <el-dialog title="题干详情" :visible.sync="topicVisible">
      <!-- markworn形式展示 -->
      <div v-html="topic"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="topicVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
// import SelectStudent from "./components/";
import Pagination from "@/components/Pagination";
import { getWrongbook, getWrongDetail } from "@/api/wrong";
import EtnWrongDetail from "@/components/EtnWrongDetail";
import * as APP from "@/utils/common";

export default {
  components: { Pagination, EtnWrongDetail },
  computed: {
    ...mapGetters(["baseURL"])
  },
  data() {
    return {
      keyword: "",
      listLoading: false,
      answerTypeList: [],
      list: null,
      querySort: "全部",
      listQuery: {
        keyword: "",
        type: 0,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      // 弹窗
      wrongDialogVisible: false,
      wrongDetail: {},
      // answerTypeName: "",
      // questionType: ""
      topicVisible: false, //题干详情
      topic: ""
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  filters: {
    decodeURI(val) {
      return decodeURIComponent(val);
    }
  },
  methods: {
    handleFilterDate(val) {
      console.log(val);
      this.listQuery.type = val;
      this.getList(this.listQuery);
    },
    sortChange() {},
    handleFilterSearch() {
      console.log("searching", this.keyword);
      this.listQuery.keyword = this.keyword;
      getWrongbook(this.listQuery).then(res => {
        console.log("获取错题list--->", res);
        if (res.error) {
          return this.$message.error(res.error.message);
        }
        this.list = res.result.deploymentList;
        this.total = res.result.totalCount;
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    handleSelectionChange() {},
    // 页面刷新重置
    async getList() {
      let _this = this;
      console.log(_this.listQuery);
      this.listLoading = true;
      const { result, success, error } = await getWrongbook(_this.listQuery);
      console.log("获取全部错题集", result);
      if (success) {
        console.log(result);
        this.answerTypeList = result.answerTypeList;
        this.list = result.wrongQuestionList;
        this.total = result.totalCount;
      }
      if (error) {
        this.list = [];
        this.total = 0;
        this.$message.error(error.message);
      }
      this.listLoading = false;
    },
    async handleDetail(row) {
      console.log(row);
      const { result, error } = await getWrongDetail({
        scheduleId: row.scheduleId,
        questionId: row.questionId
      });
      if (result) {
        console.log(result);
        this.wrongDialogVisible = true;
        this.wrongDetail = result;
        this.answerTypeName = row.answerTypeName;
        this.questionType = row.questionType;
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    handlerClosewrongDialog() {
      this.wrongDialogVisible = false;
    },
    topicHandle(row) {
      console.log("查看题干", row);
      this.topicVisible = true;
      // this.topic = row.group.topic;
      if (row.group.content[0]) {
        // 处理markdown
        this.topic = this.getHtml(row.group.content[0].contentValue);
      } else {
        this.topic = "";
      }
    },
    getHtml(val) {
      // 解码
      let decodeVal = decodeURIComponent(val);
      // 转markdown
      return APP.markedText(decodeVal);
    }
  }
};
</script>

<style scoped lang="scss">
.tab-container {
  margin: 30px;
  .wrong-table {
    .wrong-topic {
      white-space: nowrap;
    }
    .wrong-table-typeName {
      background: #fff;
      border: 1px solid #1890ff;
    }
    .wrong-table-questionType {
      background: #fff;
      border: 1px;
    }
  }

  // 错题详情弹窗
}
</style>
