<template>
  <div class="tab-container">
    <el-select
      v-model="selected"
      style="width: 180px;margin-top:-10px"
      class="filter-item"
      @change="handleFilterCategory"
    >
      <el-option
        v-for="(item, index) in categoryList"
        :key="index"
        :label="item.name"
        :value="item.name"
      />
    </el-select>
    <el-input
      v-model="keyword"
      placeholder="请输入试卷名称"
      style="width: 200px;margin-left:5px"
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
      :data="productBookList"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:15px"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        label="试卷名称"
        prop="testPaperName"
        sortable
        align="left"
        min-width="160"
      >
        <template slot-scope="{ row }">
          <div class="record-table-productName">
            <el-image :src="baseURL + row.thumbnail_Small"></el-image>
            <span class="record-productName">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="作者" min-width="140px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author ? row.author : "未知" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="试卷数"
        prop="testPaperCount"
        sortable
        width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.testPaperCount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="浏览"
        width="90px"
        align="center"
        sortable
        prop="viewingCount"
      >
        <template slot-scope="{ row }">
          <span>{{ row.viewingCount }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="标签"
        prop="isDiscount"
        min-width="100px"
        align="center"
      >
        <template slot-scope="{ row }">
          <template
            v-if="
              row.isDiscount || row.isHot || row.isOriginal || row.isRecommand
            "
          >
            <el-tag v-if="row.isHot" type="danger" class="book-list-tag"
              >热门</el-tag
            >
            <el-tag v-if="row.isDiscount" type="danger" class="book-list-tag"
              >促销</el-tag
            >
            <el-tag v-if="row.isOriginal" type="danger" class="book-list-tag"
              >原创</el-tag
            >
            <el-tag v-if="row.isRecommand" type="danger" class="book-list-tag"
              >推荐</el-tag
            >
            <el-tag v-if="row.isNew" type="danger" class="book-list-tag"
              >新品</el-tag
            >
          </template>
          <template v-else>
            未知
          </template>
        </template>
      </el-table-column>

      <el-table-column label="出版社简称" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag
            type="danger"
            style="border:1px solid #ff4949;background:#ff4949;color:#fff"
            >{{ row.publishingHouseShortName }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="出版社" min-width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.publishingHouseName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleDetail(row)">
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
      :page-sizes="[6, 20, 30, 50]"
      @pagination="getList"
    />
  </div>
</template>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { getProductBookList } from "@/api/book";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";

export default {
  name: "Database",
  components: { Pagination },
  computed: {
    ...mapGetters(["baseURL"])
  },
  data() {
    return {
      productBookList: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 6
      },
      categoryList: null,
      keyword: "",
      selected: "" //筛选本周本月...
    };
  },
  watch: {
    keyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    }
  },
  created() {
    // this.listQuery.keyword = "V20210517";
    this.getList();
  },
  methods: {
    initListQuery() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 6
      };
    },
    handleFilterCategory(value) {
      console.log("value", value);
      // this.listQuery.keyword = value;
      const search = this.categoryList.filter(item => {
        return item.name === value;
      });
      console.log("search==>", search);
      this.listQuery.categoryId = search[0].categoryId;
      this.getList(this.listQuery);
    },
    handleFilter() {
      this.listQuery.keyword = this.keyword;
      this.getList(this.listQuery);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    },
    async getList() {
      this.listLoading = true;
      const result = await getProductBookList(this.listQuery);
      if (result.error) {
        this.$message.error("请求错误");
      }
      console.log("获取book列表", result.result);
      this.productBookList = result.result.productList;
      // testing 倒叙
      this.productBookList = this.productBookList.reverse();

      this.total = result.result.totalCount;
      this.categoryList = result.result.categoryList;

      const select = this.categoryList.filter(item => {
        return item.isSelected;
      });
      this.selected = select[0].name;
      console.log(this.selected);
      console.log(select);

      setTimeout(() => {
        this.listLoading = false;
      }, 100);
    },
    async handleDetail(book) {
      console.log("查看书籍", book);
      // this.listQuery.productSerialNo = book.serialNo;
      // let data = this.listQuery;
      let data = {
        pageIndex: 1,
        pageSize: 8,
        productSerialNo: book.serialNo
      };
      this.$router.push({
        path: `/examdatabase/bookDetail`,
        query: data
      });
    }
  }
};
</script>

<style scoped lang="scss">
.tab-container {
  margin: 30px;
}
.book-list-tag {
  border: 1px solid #ff4949;
  margin: 5px;
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
</style>
