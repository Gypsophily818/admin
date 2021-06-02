<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- 参与人 -->
      <template v-if="type === '参与人' && !!detailObj">
        <el-table-column
          prop="userName"
          align="center"
          label="学生"
          width="200"
          element-loading-text="请给我点时间！"
        >
          <template slot-scope="{ row }">
            <div class="user-name">
              <el-avatar
                size="medium"
                :src="baseURL + row.avatar_Middle"
              ></el-avatar>
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="avgPassableRate"
          min-width="180px"
          align="center"
          label="平均达标率"
        >
          <template slot-scope="{ row }">
            <span>{{ row.avgPassableRate | parseRate }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="180px" align="center" label="平均完成率">
          <template slot-scope="scope">
            <span>{{ scope.row.avgFinishedRate | parseRate }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" align="center" label="平均回合数">
          <template slot-scope="scope">
            <span>{{ scope.row.avgRound }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="" align="center" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="handleAttendDetail(row)"
            >
              查看该生
            </el-button>
          </template>
        </el-table-column>
      </template>

      <!-- 试卷 -->
      <template v-if="type === '试卷'">
        <el-table-column
          prop="avgPassableRate"
          min-width="160px"
          align="center"
          label="产品名称"
          element-loading-text="请给我点时间！"
          class="record-paper-table"
        >
          <template slot-scope="{ row }">
            <div class="record-table-productName">
              <el-image :src="baseURL + row.thumbnail_Small"></el-image>
              <span class="record-productName">{{ row.productName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="testPaperName"
          align="center"
          label="试卷名称"
          min-width="140px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.testPaperName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="requireFinishMinWordsCount"
          min-width="70px"
          align="center"
          label="试题数"
        >
          <template slot-scope="{ row }">
            <span>{{ row.requireFinishMinWordsCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="requireFinishMinRate"
          min-width="130px"
          align="center"
          label="要求最低合格率"
        >
          <template slot-scope="{ row }">
            <span>{{ row.requireFinishMinRate | parseRate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="requireFinishMinRateNum"
          min-width="130px"
          align="center"
          label="要求完成时长"
        >
          <template slot-scope="{ row }">
            <span
              >{{ row.requireFinishMinDuration }}~{{
                row.requireFinishMaxDuration
              }}</span
            >
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="95">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="handlePaperDetail(row.testPaperSerialNo)"
            >
              查看</el-button
            >
          </template>
        </el-table-column>

        <!-- 试卷详情 -->
        <!-- v-if="type === 'Paper'" -->
        <el-dialog
          title="试卷详情"
          :visible.sync="dialogPvVisible"
          :append-to-body="true"
          :modal-append-to-body="false"
          class="record-paper-detail"
          width="70%"
        >
          <div class="is-necessary">
            <i class="block-icon"></i>
            <span class="text">必做</span>
          </div>
          <header class="test-paper-title">{{ "试卷名称(标题)" }}</header>

          <!-- 试卷要求 -->
          <el-table
            v-if="!!testPaperData"
            border
            :data="testPaperData"
            class="record-paper-detail-table"
          >
            <el-table-column
              label="要求完成时长"
              min-width="140"
              align="center"
              prop="requireFinishedDuration"
            >
              <template slot-scope="{ row }">
                <span>{{ row.requireFinishedDuration }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="要求合格率"
              min-width="140"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ row.requirePassableRate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="包含题型"
              min-width="140"
              align="center"
            >
              <template slot-scope="{ row }">
                <template v-for="(word, index) in row.includeQuestionType">
                  <span :key="index">
                    {{ word
                    }}{{
                      index === row.includeQuestionType.length - 1 ? "" : "，"
                    }}
                  </span>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPvVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </template>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      :page-sizes="[8, 20, 30, 50]"
      @pagination="refreshList"
    />
  </div>
</template>

<script>
import Kanban from "./Kanban/drag-kanban";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  getPaperRecordDetails,
  getRecordDetails,
  getPaperDetails
} from "@/api/record";
import RecordPaperDetail from "./RecordPaperDetail"; // secondary package based on el-pagination
import { parseRate } from "@/utils/common"; // 引入公共方法

export default {
  filters: {
    parseRate // 使用公共方法
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  props: {
    type: {
      type: String,
      default: "Attend"
    },
    scheduleId: {
      type: Number
    },
    detailObj: "detailObj",
    resetDetailPageInde: {
      type: Number
    }
  },
  props: ["type", "scheduleId", "detailObj", "resetDetailPageInde"],
  components: { Pagination, RecordPaperDetail, Kanban },
  data() {
    return {
      value: [],
      //---
      testPaperData: null,
      paperList: [],
      list: null,
      listQuery: {
        pageIndex: 1,
        pageSize: 8,
        jobScheduleId: ""
      },
      loading: false,
      total: 0,
      dialogPvVisible: false,
      testPaperSerialNo: ""
    };
  },
  created() {
    console.log("scheduleId--recordData", this.scheduleId);
    this.getList();
  },
  mounted() {
    console.log("mounted");
  },
  watch: {
    scheduleId() {
      this.getList();
    },
    resetDetailPageInde() {
      this.listQuery.pageIndex = 1;
    }
  },
  methods: {
    async getList() {
      this.loading = true;
      if (this.type === "参与人") {
        this.list = this.detailObj;
        this.list = this.sliceList(this.list, 8)[this.listQuery.pageIndex - 1];
        console.log("参与人==>", this.list);
        this.total = this.detailObj.length;
      } else if (this.type === "试卷") {
        this.listQuery.jobScheduleId = this.scheduleId;
        console.log(this.listQuery);
        const paperArr = await getPaperRecordDetails(this.listQuery);
        console.log("获取试卷列表===>", paperArr);
        if (!!paperArr.result.items) {
          this.list = paperArr.result.items;
          this.total = paperArr.result.totalCount;
        }
      }
      this.loading = false;
    },
    refreshList({ page }) {
      console.log(page);
      this.listQuery.pageIndex = page;
      this.getList();
    },
    sliceList(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    handleAttendDetail(row) {
      console.log("查看该生", row);
      this.$emit("close-checkDialogVisible");
      this.$router.push({
        path: "/record/studentRecord",
        query: { jobPlanId: row.jobPlanId, userId: row.userId }
      });
    },
    async handlePaperDetail(id) {
      // this.testPaperSerialNo = id;
      const paperDetailResult = await getPaperDetails({
        testPaperSerialNo: id
      });

      if (!!paperDetailResult.error) {
        this.$message.error(paperDetailResult.error.message);
      }

      // requireFinishedDuration requirePassableRate includeQuestionType[arr]
      let dataPaper = [
        {
          requireFinishedDuration: "",
          requirePassableRate: "",
          includeQuestionType: ""
        }
      ];
      console.log();

      let result = paperDetailResult.result;

      console.log(
        "获取试卷详情--试卷编号===>",
        id,
        "试卷ID===>",
        this.scheduleId,
        result
      );
      for (let key in result) {
        if (
          key === "requireFinishedDuration" ||
          key === "requirePassableRate" ||
          key === "includeQuestionType"
        ) {
          dataPaper[0][key] = result[key];
        }
      }
      this.testPaperData = dataPaper;
      console.log("testPaperData", dataPaper);
      // 试题展示(待完成)
      // this.paperList = result...
      this.dialogPvVisible = true;
    },
    getDetail() {
      // this.listQuery;
      getRecordDetails(this.listQuery)
        .then(result => {
          console.log("作业详情===>", result.result);
          this.detailObj = { ...result.result };
        })
        .catch(err => {
          new Error(err);
        });
    },
    initPageIndex() {
      this.listQuery.pageIndex = 1;
    }
  }
};
</script>
<style lang="scss">
.user-name {
  // background: skyblue;
  display: box;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  -o-justify-content: flex-start;

  align-items: center;
  -webkit-align-items: center;
  -moz-align-items: center;
  -ms-align-items: center;
  -o-align-items: center;
  .el-avatar {
    min-width: 36px;
  }
  span {
    margin-left: 8px;
  }
}
.el-tabs {
  box-shadow: none;
}
.record-table-productName {
  display: flex;
  .el-image {
    width: 80px;
    height: 80px;
  }
  .record-productName {
    width: 50%;
    overflow: hidden;
  }
}

.record-paper-detail {
  .el-dialog__header {
    border-bottom: 1px solid #dcdfe6;
  }
  .is-necessary {
    margin-top: -15px;
    display: flex;
    align-items: center;
    .block-icon {
      margin-right: 5px;
      display: block;
      width: 20px;
      height: 14px;
      background: #409eef;
    }
    .text {
      width: 40px;
      height: 28px;
      font-size: 20px;
      line-height: 29px;
      color: #303133;
    }
  }
  .test-paper-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 42px;
    font-size: 28px;
    font-weight: 500;
    color: #303133;
  }

  .record-paper-detail-table {
    margin-top: 10px;
    .has-gutter {
      font-size: 16px;
      color: #303133;
      tr {
        th {
          background: #dcdfe6;
        }
      }
    }
  }
}
</style>
