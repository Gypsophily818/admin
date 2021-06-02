<template>
  <div>
    <!-- 单击查看 错题 详情 -->
    <el-dialog
      top="40px"
      title="错题"
      :visible.sync="dialogVIsible"
      width="60%"
      style="margin-top:0px"
      @close="$emit('close-wrong-dialog')"
    >
      <!-- 筛选 -->
      <el-select
        v-model="querySort"
        style="width: 140px;margin-bottom:5px;"
        class="filter-item"
        @change="handleFilterSort"
      >
        <el-option
          v-for="(item, index) in answerTypeList"
          :key="index"
          :label="item.answerTypeName"
          :value="item.answerType"
        />
      </el-select>
      <!-- 搜索错题 -->
      <el-input
        v-model="keyword"
        placeholder="请输入搜索内容"
        style="width: 200px;margin-left:10px;margin-right:10px"
        class="filter-item"
        @keyup.enter.native="filterSearchWrong"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="filterSearchWrong"
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
        @selection-change="handleSelectionChange"
      >
        <!-- @sort-change="sortChange" -->
        <el-table-column label="题干" prop="group" align="left" min-width="400">
          <template slot-scope="{ row }">
            <!-- <span @click="topicHandle(row)" class="wrong-topic link-type">{{
              row.group.topic
            }}</span> -->

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
          min-width="100px"
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

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$emit('close-wrong-dialog')"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 单击查看 题干 详情 -->
    <el-dialog
      v-if="topicVisible"
      top="40px"
      title="题干详情"
      :visible.sync="topicVisible"
      width="40%"
    >
      <!-- markworn形式展示 -->
      <div v-html="topic"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="topicVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 错题详情 弹窗 -->
    <el-dialog
      v-if="paperDetailVisible"
      top="40px"
      title="错题详情"
      :visible.sync="paperDetailVisible"
      width="50%"
    >
      <!-- @close="handlerClosewrongDialog" -->
      <!-- 错题详情 -->
      <EtnWrongDetail :details="paperDetail" />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paperDetailVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import EtnWrongDetail from "@/components/EtnWrongDetail";
import * as APP from "@/utils/common";

import { getWrongQuestionList, getWrongQuestionDetails } from "@/api/record";
export default {
  name: "WrongList",
  components: {
    Pagination,
    EtnWrongDetail
  },
  props: {
    wrongDialogVisible: {
      typeof: Boolean,
      default: false
    },
    scheduleId: {
      typeof: Number,
      default: ""
    }
  },
  computed: {
    dialogVIsible: {
      get() {
        return this.wrongDialogVisible;
      },
      set() {
        return this.wrongDialogVisible;
      }
    }
  },
  filters: {
    decodeURI(val) {
      return decodeURIComponent(val);
    }
  },
  created() {
    this.getList();
  },
  watch: {
    keyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    }
  },
  data() {
    return {
      listLoading: false,
      //   dialogVIsible: this.wrongDialogVisible, //  wrongDialogVisible: false, // 错题集弹窗
      keyword: "",
      list: [],
      querySort: "全部",
      answerTypeList: [],
      listQuery: {
        scheduleId: "",
        keyword: "",
        type: 0,
        pageIndex: 1,
        pageSize: 8
      },
      total: 0,
      topicVisible: false, //   题干
      topic: "",
      paperDetailVisible: false, // 试卷详情
      paperDetail: ""
    };
  },
  methods: {
    initListQuery() {
      this.listQuery = {
        // scheduleId:329,
        keyword: "",
        // dateType: 0,
        pageIndex: 1,
        pageSize: 8
      };
      this.listQuery.type = this.querySort;
    },
    handleFilterSort(val) {
      console.log(val);
      this.listQuery.type = val;
      this.getList(this.listQuery);
    },
    filterSearchWrong() {
      // 搜索错题
      console.log("searching错题", this.keyword);
      this.listQuery.keyword = this.keyword;
      this.getList(this.listQuery);
    },
    async getList() {
      let _this = this;
      _this.listQuery.scheduleId = this.scheduleId;
      this.querySort = _this.listQuery.type;
      this.listLoading = true;
      //   const { result } = await getWrongQuestionList(_this.listQuery);
      const res = await getWrongQuestionList(_this.listQuery);
      console.log("获取作业错题集", res);
      if (res.success) {
        this.answerTypeList = res.result.answerTypeList;
        this.answerTypeList = this.answerTypeList.sort((a, b) => {
          return a.answerType - b.answerType;
        });
        this.list = res.result.wrongQuestionList;
        this.total = res.result.totalCount;
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
      this.listLoading = false;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    topicHandle(row) {
      //查看题干
      console.log("查看题干", row);
      this.topicVisible = true;
      if (row.group.content[0]) {
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
    },
    async handleDetail(row) {
      // 打开试卷详情
      console.log(row);
      const res = await getWrongQuestionDetails({
        scheduleId: row.scheduleId,
        questionId: row.questionId
      });
      console.log(res);
      if (res.success) {
        this.paperDetailVisible = true;
        this.paperDetail = res.result;
        this.answerTypeName = row.answerTypeName;
        this.questionType = row.questionType;
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrong-topic {
  white-space: nowrap;
}
</style>
