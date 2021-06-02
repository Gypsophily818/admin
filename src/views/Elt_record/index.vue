<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilterDate"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <!-- 搜索布置记录 -->
      <el-input
        v-model="searchJob"
        placeholder="请输入搜索内容"
        style="width: 200px;margin-left:10px;margin-right:10px"
        class="filter-item"
        @keyup.enter.native="handleFilterSearch"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilterSearch"
      >
        搜索
      </el-button>

      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        style="margin-left:10px"
      >
        导出已选项
      </el-button> -->
      <el-button
        type="success"
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        icon="el-icon-edit"
        @click="$router.push('/record/publish')"
        style="margin-left:10px"
      >
        布置作业
      </el-button>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" align="center" />
      <!-- sortable="custom" -->
      <el-table-column
        label="作业名称"
        prop="jobPlanName"
        align="left"
        width="160"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleRemark(row)">{{
            row.jobPlanName
          }}</span>
        </template>
      </el-table-column>

      <!-- start-date -->
      <el-table-column
        label="作业时间"
        prop="startDateTime"
        sortable
        width="160px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div class="timewapper">
            <div>开始:{{ row.startDateTime }}</div>
            <div>结束:{{ row.endDateTime }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- end-date -->
      <el-table-column
        label="参与人数"
        prop="userCount"
        sortable
        width="120px"
        align="center"
      >
        <template slot-scope="{ row }">
          <!-- type="success" -->
          <el-button type="primary" size="mini" @click="userCountBtn(row)">
            {{ row.userCount }}
          </el-button>
        </template>
      </el-table-column>

      <!-- end-date -->
      <el-table-column
        label="布置试卷数"
        prop="testPaperCount"
        sortable
        width="120px"
        align="center"
      >
        <template slot-scope="{ row }">
          <!-- type="success" -->
          <el-button type="primary" size="mini" @click="paperDialogBtn(row)">
            {{ row.testPaperCount }}
          </el-button>
        </template>
      </el-table-column>

      <!-- 布置人 -->
      <el-table-column label="布置人" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag type="info">
            {{ row.arranger }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        align="center"
        min-width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            plain
            size="mini"
            @click="wrongDetailBtn(row.scheduleId)"
          >
            错题集
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleDetail(row.scheduleId)"
          >
            查看
          </el-button>
          <!-- style="margin-left: 10px;" -->
          <!-- class="filter-item" -->
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="handleCreate(row)"
          >
            重新布置
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

    <!-- 备注 -->
    <el-dialog title="备注" :visible.sync="remarkVisible">
      <span>{{ remarks }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 单击查看 参与人 / 布置试卷数 详情 -->
    <el-dialog
      v-if="checkDialogVisible"
      top="40px"
      :title="checkName"
      :visible.sync="checkDialogVisible"
      width="70%"
      @close="handlerClosecheckDialog"
    >
      <RecordData
        :type="checkName"
        :scheduleId="scheduleId"
        :detailObj="checkdata"
        @close-checkDialogVisible="handlerClosecheckDialog()"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 单击查看 错题 详情 -->
    <WrongList
      v-if="wrongDialogVisible"
      :scheduleId="wrongScheduleId"
      :wrongDialogVisible="wrongDialogVisible"
      @close-wrong-dialog="wrongDialogVisible = false"
    />

    <!-- 布置记录详情 -->
    <el-dialog
      top="40px"
      title="作业详情"
      :visible.sync="detailDialogVisible"
      width="70%"
      @close="handlerClose"
    >
      <el-tabs
        v-model="activeName"
        style="margin-top:-15px;"
        type="border-card"
      >
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <tab-pane
            v-if="activeName == item.key"
            :type="item.key"
            :scheduleId="scheduleId"
            :detailObj="detailObj"
            :resetDetailPageInde="resetDetailPageInde"
            @close-dialog="handlerClose()"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerClose">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import {
  getDeploymentRecord,
  getRecordDetails,
  getWrongQuestionList
} from "@/api/record";
import waves from "@/directive/waves"; // waves directive

import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import TabPane from "./components/TabPane";
import RecordData from "./components/RecordData";
import WrongList from "./components/WrongList";

export default {
  name: "RecordPage",
  components: { Pagination, TabPane, RecordData, WrongList },
  directives: { waves },
  filters: {},
  data() {
    return {
      multipleSelection: [],
      searchJob: "",
      tabMapOptions: [
        { label: "参与人", key: "Attend" },
        { label: "试卷", key: "Paper" }
        // { label: "错题集", key: "Wrong" }
      ],
      activeName: "Attend",
      checkName: "", //查看参与人、试卷
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        sort: "全部",
        keyword: "",
        dateType: 0,
        pageIndex: 1,
        pageSize: 8
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "全部", key: "All" },
        { label: "本周", key: "Week" },
        { label: "本月", key: "Month" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      scheduleId: "",
      wrongScheduleId: "",
      detailObj: {},
      detailDialogVisible: false,
      dialogFormVisible: false,
      remarkVisible: false, //备注弹窗
      checkDialogVisible: false, //参与人弹窗/布置试卷数弹窗
      checkdata: "",
      dialogStatus: "布置作业",
      textMap: {
        update: "Edit",
        resetRecord: "重新布置作业",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false,
      resetDetailPageInde: 1,
      // 备注
      remarks: "",
      // 错题集
      wrongDialogVisible: false, // 错题集弹窗
      keyword: "",
      wrongList: [],
      querySort: "全部",
      answerTypeList: [],
      wrongListQuery: {
        sort: "全部",
        keyword: "",
        dateType: 0,
        pageIndex: 1,
        pageSize: 8
      }
    };
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`);
    },
    searchJob(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    }
  },
  created() {
    this.getList();
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
  },
  methods: {
    initListQuery() {
      this.listQuery = {
        sort: "全部",
        keyword: "",
        dateType: 0,
        pageIndex: 1,
        pageSize: 8
      };
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        // return "success-row"; return "warning-row";
      }
      return "";
    },
    async getList(dateType) {
      this.listLoading = true;
      if (typeof dateType === "object") {
        const { limit, page } = dateType;
        console.log(limit, page);
        this.listQuery.pageSize = limit;
        this.listQuery.pageIndex = page;
      } else {
        this.listQuery.dateType = dateType || 0;
      }

      const { result, success, error } = await getDeploymentRecord(
        this.listQuery
      );
      if (success) {
        this.list = result.deploymentList;
        this.total = result.totalCount;
      }
      if (error) {
        this.$message.error(error.message);
      }
      this.listLoading = false;
    },
    handleFilterDate(value) {
      console.log(value);
      switch (value) {
        case "Week":
          this.listQuery.dateType = 1;
          break;
        case "Month":
          this.listQuery.dateType = 2;
          break;

        default:
          this.listQuery.dateType = 0;
          break;
      }
      this.getList(this.listQuery.dateType);
      console.log("获取=>" + value + "的布置记录");
    },
    // handleFilter() {
    //   this.listQuery.page = 1;
    //   this.getList();
    // },
    async handleFilterSearch() {
      // 搜索布置记录
      console.log("searching-keyword", this.searchJob);
      this.listQuery.keyword = this.searchJob;

      const { result, success, error } = await getDeploymentRecord(
        this.listQuery
      );
      console.log("searching", result);

      if (success) {
        this.list = result.deploymentList;
        this.total = result.totalCount;
      }
      if (error) {
        this.$message.error(error.message);
      }
      this.listLoading = false;
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate(row) {
      console.log(row);
      this.$router.push({
        path: "/record/publish",
        query: { scheduleId: row.scheduleId }
      });
    },
    handleFilterSort(val) {
      console.log(val);
      this.listQuery.type = val;
      this.getList(this.listQuery);
    },
    async filterSearchWrong() {
      // 搜索错题
      console.log("searching错题", this.keyword);
      this.wrongListQuery.keyword = this.keyword;

      const { result, success, error } = await getWrongQuestionList(
        this.wrongListQuery
      );
      console.log("获取布置记录list--->", result);

      if (success) {
        this.list = result.deploymentList;
        this.total = result.totalCount;
      }
      if (error) {
        this.$message.error(error.message);
      }
      this.listLoading = false;
    },
    async wrongDetailBtn(scheduleId) {
      // 错题集
      console.log("错题集scheduleId :>> ", scheduleId);
      this.wrongScheduleId = scheduleId;

      // const { result } = await getWrongQuestionList(this.wrongListQuery);
      // console.log(result);
      this.wrongDialogVisible = true;
    },
    async handleDetail(scheduleId) {
      console.log("1---scheduleId", scheduleId);
      this.scheduleId = scheduleId;

      const { result, success, error } = await getRecordDetails({ scheduleId });
      console.log("作业详情===>", result);

      if (success) {
        this.detailObj = { ...result };
        console.log("detailObj", this.detailObj);
        this.detailDialogVisible = true;
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    handleRemark(row) {
      console.log("查看备注");
      this.remarkVisible = true;
      this.remarks = row.remarks;
    },
    async userCountBtn(row) {
      // 参与人数详情
      console.log("查看参与人", row.scheduleId);
      this.scheduleId = row.scheduleId;
      // 获取行 scheduleId
      const { result, success, error } = await getRecordDetails({
        scheduleId: this.scheduleId
      });
      if (success) {
        this.checkdata = result.studentList;
        // 进入参与人列表(弹窗)
        this.checkDialogVisible = true;
      }
      if (error) {
        this.$message.error(error.message);
      }
      this.checkName = "参与人";
    },
    paperDialogBtn(row) {
      console.log("查看试卷", row);
      this.scheduleId = row.scheduleId;
      this.checkName = "试卷";
      this.checkDialogVisible = true;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        alert("导出");
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "练习任务名称",
            "创建时间",
            "作业开始时间",
            "作业结束时间",
            "参与人数",
            "布置试卷数",
            "备注",
            "布置人"
          ];
          const filterVal = [
            "jobPlanName",
            "creationTime",
            "startDateTime",
            "endDateTime",
            "userCount",
            "testPaperCount",
            "remarks",
            "arranger"
          ];
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "布置记录表" + new Date().toLocaleDateString()
          });
          this.$refs.multipleTable.clearSelection();
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "Please select at least one item",
          type: "warning"
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handlerClose() {
      console.log("关闭重置页数为--->1");
      this.detailDialogVisible = false;
      this.resetDetailPageInde = Date.now();
    },
    handlerClosecheckDialog() {
      this.checkDialogVisible = false;
    }
  }
};
</script>
<style lang="scss">
.timewapper {
  div {
    white-space: nowrap;
  }
}
</style>
