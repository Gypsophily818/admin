<template>
  <div class="app-container">
    <el-row :gutter="10" v-if="total > 0">
      <el-col
        class="report-boxWrapper"
        :cm="12"
        :sm="8"
        :md="8"
        :lg="6"
        v-for="(item, index) in reportList"
        :key="index"
        @click.native="handleDetail(item)"
      >
        <el-card :body-style="{ padding: '0px' }">
          <!--  -->
          <el-image
            class="report-indexImg"
            :src="baseURL + item.schedulePictureUrl"
          >
            <div slot="error" class="image-slot">
              <svg-icon icon-class="pictureLoadFail" />
              <p class="error-p">图片加载失败</p>
            </div>
          </el-image>

          <div style="padding: 14px;" class="report-text-wrapper">
            <span class="report-arranger">{{ item.arranger }}</span>
            <span class="report-lanName">{{ item.schedulePlanName }}</span>
            <div class="bottom clearfix">
              <time class="reportPublish-datetime">
                {{ item.scheduleEndDatetime | formatDate }}&nbsp;作业报告
              </time>
              <el-button type="text" class="button" @click="handleDetail(item)"
                >查看详情</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else>暂无数据</el-row>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getReport } from "@/api/report";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";

export default {
  name: "Tab",
  components: { Pagination },
  computed: {
    ...mapGetters(["baseURL"])
  },
  filters: {
    formatDate(val) {
      return val.slice(0, 10);
    }
  },
  data() {
    return {
      reportList: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 12
      },
      keyword: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { result, success, error } = await getReport(this.listQuery);
      console.log("获取报告列表", result);

      if (success) {
        this.reportList = result.dashboardModels;
        this.total = result.totalCount;
      }
      if (error) {
        this.$message.error(error.message || "请求错误");
      }

      this.listLoading = false;
    },
    handleDetail(val) {
      this.$router.push({
        path: "/report/detail",
        query: { scheduleId: val.scheduleId }
      });
      // this.$router.push({ path: "/report/detail" });
      console.log(val);
    }
  }
};
</script>

<style scoped lang="scss">
.app-container {
  .report-boxWrapper {
    margin-top: 8px;
    &:hover {
      cursor: pointer;
    }
  }
  .report-indexImg {
    // min-height: 180px;
    width: 100%;
    .image-slot {
      svg {
        background: lightblue;
        width: 100%;
        min-height: 100px;
      }
      .error-p {
        text-align: center;
        margin: 0 auto;
      }
    }
  }
  .report-text-wrapper {
    position: relative;
    .report-arranger {
      position: absolute;
      top: -90px;
      color: #fff;
    }
    .report-lanName {
      position: absolute;
      top: -70px;
      color: #fff;
    }
    .bottom {
      line-height: 34px;
      .reportPublish-datetime {
        color: #000;
      }
      .button {
        float: right;
      }
    }
  }
  .report-plan-name {
  }
  .report-scheduleDate-range {
    // display: flex;
    .report-scheduleDate {
      white-space: nowrap;
    }
  }
}
</style>
