<template>
  <div class="app-container">
    <el-input
      v-model="keyword"
      placeholder="搜索试卷内容"
      style="width: 200px;margin-top:10px"
      class="filter-item"
      @keyup.enter.native="handleFilter"
    />
    <el-button
      style="margin-left:5px"
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >
      搜索
    </el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="paperList"
      border
      stripe
      highlight-current-row
      style="width: 100%;margin-top:15px"
    >
      <el-table-column label="试卷名称" min-width="200px" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.testPaperDisplayName }}</span>
          <el-tag class="bookDetailPaper-tag">
            {{ row.testPaperRequireTypeName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="试题数"
        prop="questionsCount"
        sortable
        width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.questionsCount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="最低要求合格率"
        min-width="160px"
        align="center"
        sortable
        prop="requireFinishedRate"
      >
        <template slot-scope="{ row }">
          <span>{{ row.requireFinishedRate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="要求完成时长"
        min-width="160px"
        align="center"
        prop="requireFinishedDuration"
      >
        <template slot-scope="{ row }">
          <span>{{ row.requireFinishedDuration }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="operation"
        label="操作"
        align="center"
        width="100"
        prop="testPaperSerialNo"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleDetail(row.testPaperSerialNo)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getDetailList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getProductBookItem } from "@/api/book";

export default {
  props: {
    operation: {
      type: Boolean
    }
  },
  components: {
    Pagination
  },
  created() {
    this.getDetailList();
  },
  watch: {
    keyword(n, o) {
      if (n === "") {
        this.handleFilter();
      }
    }
  },
  data() {
    return {
      keyword: "",
      listLoading: true,
      paperList: [],
      total: 0,
      listQuery: {
        pageIndex: 0,
        pageSize: 10
      }
    };
  },
  methods: {
    handleFilter() {
      console.log(this.keyword);
      this.listQuery.keyword = this.keyword;
      this.getDetailList(this.listQuery);
    },
    async getDetailList() {
      const detail = await getProductBookItem(this.listQuery);

      console.log('this.listQuery',this.listQuery);
      this.details = detail.result.bookDetail;
      this.paperList = detail.result.testPaperList;
      this.total = detail.result.totalCount;
      console.log("paperList", detail.result.testPaperList);

      setTimeout(() => {
        this.listLoading = false;
      }, 200);
    },
    async handleDetail(paper) {
      console.log("查看试卷", paper);

      this.$router.push({
        path: "/examdatabase/paperDetail",
        query: { paper }
      });
    }
  }
};
</script>

<style></style>
