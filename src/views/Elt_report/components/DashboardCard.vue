<template>
  <el-card :body-style="{ padding: '0px' }" class="dashboard-card">
    <!-- <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      class="image"
    /> -->

    <div style="padding: 14px;" v-if="dashboard">
      <h3 class="clear-marginTop">作业完成情况</h3>
      <el-row type="flex" justify="space-around">
        <h4 class="clear-marginTop">
          <el-row type="flex" justify="center">
            <nav>完成率</nav>
          </el-row>

          <el-row type="flex" justify="center">
            <span class="status_num_black">
              {{ dashboard.avgFinishedRate | parseRate }}
            </span>
          </el-row>
        </h4>
        <h4 class="clear-marginTop">
          <el-row type="flex" justify="center">
            <nav>通过率</nav>
          </el-row>

          <el-row type="flex" justify="center">
            <span class="status_num_black">
              {{ dashboard.avgPassableRate | parseRate }}
            </span>
          </el-row>
        </h4>
      </el-row>

      <div class="bottom clearfix">
        <el-row :gutter="8" type="flex">
          <el-col>
            <el-row type="flex" justify="center">
              <nav>已完成</nav>
            </el-row>

            <el-row type="flex" justify="center">
              <span class="status_num_black">
                <count-to
                  :start-val="0"
                  :end-val="dashboard.totalNumberOfFinished"
                  :duration="2000"
                  class="card-panel-num"
                />

                <!-- {{ dashboard.totalNumberOfFinished }}人 -->
                人
              </span>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="center">
              <nav>未完成</nav>
            </el-row>

            <el-row type="flex" justify="center">
              <span class="status_num_black">
                <count-to
                  :start-val="0"
                  :end-val="dashboard.totalNumberOfUnfinished"
                  :duration="2000"
                  class="card-panel-num"
                />
                <!-- {{ dashboard.totalNumberOfUnfinished }}人 -->
                人
              </span>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="center">
              <nav>已通过</nav>
            </el-row>
            <el-row type="flex" justify="center">
              <span class="status_num_black">
                {{ dashboard.totalNumberOfQualified }}人
              </span>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="center">
              <nav>未通过</nav>
            </el-row>

            <el-row type="flex" justify="center">
              <span class="status_num_black">
                {{ dashboard.totalNumberOfUnqualified }}人
              </span>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="center">
              <nav>未做</nav>
            </el-row>

            <el-row type="flex" justify="center">
              <span class="status_num_black">
                {{ dashboard.totalNumberOfIgnored }}人
              </span>
            </el-row>
          </el-col>
        </el-row>

        <p v-if="dashboard.schedulePlanName">
          {{ dashboard.schedulePlanName }}
        </p>
        <p v-if="dashboard.remarks">{{ dashboard.remarks }}</p>
        <p v-if="dashboard.scheduleStartDatetime">
          {{ dashboard.scheduleStartDatetime }}~{{
            dashboard.scheduleEndDatetime
          }}
        </p>
        <el-row type="flex" justify="space-between">
          <span>参与人：{{ dashboard.userCount || 0 }}人</span>
          <span>试卷:{{ dashboard.totalNumberOfTestPaper || 0 }}份</span>
          <span>题数:{{ dashboard.totalNumberOfQuestions || 0 }}道</span>
        </el-row>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { parseRate } from "@/utils/common";
import CountTo from "vue-count-to";

export default {
  props: ["dashboard"],
  components: { CountTo },
  computed: {
    ...mapGetters([])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger"
      };
      return statusMap[status];
    },
    parseRate: parseRate
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    };
  }
};
</script>

<style lang="scss">
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.dashboard-card {
  background: #81d3f8;
}
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px !important;
    width: 70px !important;
    position: absolute !important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none !important;
    ::v-deep .pan-info {
      box-shadow: none !important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
.clear-marginTop {
  margin-top: 0;
}
</style>
