<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="user-name">
            <el-avatar
              v-if="list.avatar_Middle"
              size="medium"
              :src="baseURL + list.avatar_Middle"
            ></el-avatar>
            <span style="margin-left: 8px;">{{
              list.userName
                ? list.userName + "(" + list.fullName + ")"
                : "头像获取请求失败"
            }}</span>
          </div>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="8" class="text-center">
            <!-- 通过率 -->
            <span class="pass-rate">{{ gobalName.Homework_Pass }}:</span>
            <p>
              {{ list.avgPassableRate ? list.avgPassableRate : 0 | parseRate }}
            </p>
          </el-col>
          <el-col :span="8" class="text-center">
            <!-- 平均完成率 -->
            <span>{{ gobalName.Homework_Finish }}:</span>
            <p>
              {{ list.avgFinishedRate ? list.avgFinishedRate : 0 | parseRate }}
            </p>
          </el-col>
          <el-col :span="8" class="text-center">
            <!-- 平均回合数 -->
            <span>{{ gobalName.Homework_Around }}:</span>
            <p>{{ list.avgRound ? list.avgRound : 0 | parseRate }}</p>
          </el-col>
        </div>
      </el-card>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list.testPaperList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      class="table-record"
    >
      <el-table-column
        prop="userName"
        align="left"
        label="试卷名称"
        min-width="220"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="{ row }">
          <div style="margin-top:0; margin-bottom:5px;">
            <el-tag type="info" class="book-list-tag">
              第{{ row.round }}回合
            </el-tag>
            <span class="stu-creation-data">
              {{ row.creationDate }}
            </span>
          </div>
          <div class="stu-testpaper-name">
            <el-button
              type="success"
              plain
              size="mini"
              @click="handletestPaperName(row)"
            >
              {{ row.testPaperName ? row.testPaperName : row.productName }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="avgPassableRate"
        min-width="100px"
        align="center"
        label="正确率"
      >
        <template slot-scope="{ row }">
          <el-tag type="danger" effect="plain">{{ row.passableRate }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="完成率">
        <template slot-scope="{ row }">
          <el-tag type="danger" effect="plain">{{ row.finishedRate }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="试卷所花时长">
        <template slot-scope="{ row }">
          <el-tag type="info" effect="plain">{{ row.finishedDuration }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="通过状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.isItPassable ? 'success' : 'danger'">
            {{ row.isItPassable ? "通过" : "未通过" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="" align="center" label="操作" min-width="100">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleAttendDetail(row)"
          >
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

    <!-- 书本展示 -->
    <el-dialog
      v-if="bookDetail"
      top="40px"
      title="练习册信息"
      :visible.sync="wrongPaperDialogVisible"
      width="60%"
    >
      <div class="paper-img">
        <el-col>
          <div class="paper-wrapper">
            <div class="image" v-if="bookDetail.thumbnail_Small">
              <img :src="baseURL + bookDetail.thumbnail_Small" />
            </div>
            <div class="hasno-img" v-else>暂时无图</div>
            <div style="padding: 14px;padding-left:0">
              <p>教材名称:{{ bookDetail.productName }}</p>
              <p>包含试题数:{{ bookDetail.requireFinishMinWordsCount }}</p>
              <p>
                要求正确率:{{ bookDetail.requireFinishMinRate | parseRate }}
              </p>
              <p>
                要求完成时长:{{
                  bookDetail.requireFinishMinDuration +
                    "~" +
                    bookDetail.requireFinishMaxDuration
                }}
              </p>
            </div>
          </div>
        </el-col>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="wrongPaperDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 试卷展示 -->
    <el-dialog
      v-if="paperDialogVisible"
      top="40px"
      title="试卷信息"
      :visible.sync="paperDialogVisible"
      width="70%"
    >
      <!-- 试卷头部信息-->
      <!-- <el-row>
        <el-card class="box-card" v-if="bookDetail">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col style="text-align:center">
                <span>
                  {{ bookDetail.testPaperName }}
                </span>
                <header>
                  <svg-icon icon-class="start" />{{
                    bookDetail.testPaperRequireTypeName
                  }}
                </header>
              </el-col>
              <el-col :span="12" style="text-align:left">
                <span class="paper-status">
                  <el-tag
                    :type="bookDetail.isItPassable ? 'success' : 'danger'"
                  >
                    {{ bookDetail.isItPassable ? "通过" : "未通过" }}
                  </el-tag>
                </span>
              </el-col>
              <el-col :span="12" style="text-align:right">
                <span class="check-error">只看错题</span>
                <el-switch
                  v-model="isOnlyWrong"
                  active-color="#13ce66"
                ></el-switch>
              </el-col>
            </el-row>
          </div>
          <div style="margin-bottom:50px;" v-if="paperDetailData">
            <el-col :span="8" class="text-center">
              <span>{{ gobalName.Paper_Correct }}:</span>
              <p>
                {{ paperDetailData.passableRate }}
              </p>
            </el-col>

            <el-col :span="8" class="text-center">
              <span class="pass-rate">试卷所花时长:</span>
              <p>
                {{ paperDetailData.finishedDuration }}
              </p>
            </el-col>

            <el-col :span="8" class="text-center">
              <span>当前回合:</span>
              <p>{{ paperDetailData.round }}</p>
            </el-col>
          </div>
        </el-card>
      </el-row> -->

      <!-- 试卷展示 -->
      <template v-if="paperDetailData">
        <EtnPaperDetail :details="paperDetailData" />
      </template>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paperDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getStudentTestPaperList,
  getStuTestPaperListDetail
} from "@/api/record";
import EtnPaperDetail from "@/components/EtnPaperDetail";
import Pagination from "@/components/Pagination";

import { parseRate } from "@/utils/common"; // 引入公共方法

export default {
  computed: {
    ...mapGetters(["baseURL", "gobalName"])
  },
  components: {
    Pagination,
    EtnPaperDetail
  },
  created() {
    console.log(this.$route.query);
    this.getList();
  },
  watch: {
    async isOnlyWrong() {
      const { result, success, error } = await getStuTestPaperListDetail(
        this.paperDetailQuery
      );
      if (success) {
        console.log(result);
        this.paperDetailData = result;
      }
      if (error) {
        this.$message.error(error.message);
      }
    }
  },
  filters: {
    parseRate // 使用公共方法
  },
  data() {
    return {
      loading: false,
      listQuery: {
        jobPlanId: this.$route.query.jobPlanId,
        pageIndex: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      wrongPaperDialogVisible: false,
      bookDetail: "",
      paperDetailQuery: {
        userId: this.$route.query.userId,
        jobPlanId: this.$route.query.jobPlanId
      },
      paperDetailData: "", //试卷详情data
      paperContentModels: [], //试卷题目内容
      paperDialogVisible: false, //true, // 错题试卷展示
      isOnlyWrong: false // 只看错题？
    };
  },
  methods: {
    handleSelectionChange() {},
    async getList() {
      this.loading = true;
      console.log(this.listQuery);
      const res = await getStudentTestPaperList(this.listQuery);
      if (!res.success) {
        return this.$message.error(res.error.message);
      }
      const { result } = res;
      console.log("获取做题记录res", res);
      console.log("获取做题记录result", result);
      this.list = result;
      console.log("this.list", this.list);
      this.loading = false;
    },
    handletestPaperName(row) {
      console.log(row);
      this.bookDetail = row;
      this.wrongPaperDialogVisible = true;
    },
    async handleAttendDetail(row) {
      console.log("当前试卷", row);
      this.bookDetail = row;
      this.paperDialogVisible = true;

      this.paperDetailQuery.userId = this.list.userId;
      this.paperDetailQuery.testPaperId = row.testPaperId;
      this.paperDetailQuery.round = row.round;
      this.paperDetailQuery.isOnlyWrong = this.isOnlyWrong;
      console.log("getPaperDetails data ==", this.paperDetailQuery);
      /* 获取试卷详情试卷*/
      const res = await getStuTestPaperListDetail(this.paperDetailQuery);
      if (res.success) {
        console.log("---------------------------");
        console.log(res.result);
        /*处理试卷详情呈现*/
        this.paperDetailData = res.result;
        console.log("---------------------------");
        /* 试卷题目内容呈现*/
        this.paperContentModels = res.result.contentModels;
        console.log("this.paperContentModels==", this.paperContentModels);
        /* 判断是头部标题样式questionGroupType(1是组标题Group)，通过displayStyle控制样式状态：居左居右居中

          */
      }
    }
  }
};
</script>

<style scoped lang="scss">
.user-name {
  display: flex;
  align-items: center;
}

.record-table-productName {
  display: flex;

  .el-image {
    width: 80px;
    height: 80px;
  }

  .record-productName {
    margin-left: 4px;
    width: 50%;
    overflow: hidden;
  }
}

.paper-wrapper {
  border: none;
  box-shadow: none;
  width: 100%;
  display: flex;

  .image {
    margin-right: 10px;
  }
}

.table-record {
  .stu-testpaper-name {
    padding: 0px;
    text-align: center;
  }
}

.check-error {
  margin-right: 5px;
}

/* 试卷详情css  start*/
.paperImg {
  width: 60%;
  height: 300px;
}

.paperAudio {
  width: 80%;
  height: 200px;
}
</style>
