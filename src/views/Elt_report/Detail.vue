<template>
  <div class="app-container">
    <!-- <EtnLTRlayout /> -->

    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <!-- <transaction-table /> -->
        <DashboardCard :dashboard="dashboard" />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom:30px;"
      >
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :xl="{ span: 6 }"
        :lg="{ span: 6 }"
        style="margin-bottom:30px;"
      >
        <box-card :jobSituationData="jobSituationData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getReportDetail } from "@/api/report";

import PieChart from "./components/PieChart";
import BoxCard from "./components/BoxCard";
import DashboardCard from "./components/DashboardCard";

export default {
  name: "reportDetail",
  components: {
    PieChart,
    BoxCard,
    DashboardCard
  },
  created() {
    this.scheduleId = this.$route.query;
    console.log(this.scheduleId);
    this.getDetail();
  },
  data() {
    return {
      dashboard: null,
      jobSituationData: null,
      listLoading: false, //true,
      scheduleId: ""
    };
  },
  methods: {
    async getDetail() {
      this.listLoading = true;
      const { result, success, error } = await getReportDetail(this.scheduleId);
      console.log(result);
      console.log("dashboardModel :>> ", result.dashboardModel);
      console.log("jobSituationModel :>> ", result.jobSituationModel);
      if (success) {
        this.dashboard = result.dashboardModel;
        this.jobSituationData = result.jobSituationModel;
      }
      if (error) {
        this.$message.error(error.message);
      }
      this.listLoading = false;
    }
  }
};
</script>

<style></style>
