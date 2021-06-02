<template>
  <el-dialog
    :visible.sync="dialogPvVisible"
    title="选择练习册"
    :before-close="handleClose"
    width="80%"
    top="40px"
  >
    <el-row type="flex" align="middle" style="margin-top:-25px">
      <el-col :span="6">
        <el-input
          v-model.trim="keyword"
          placeholder="请输入练习册名称"
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <el-button
        style="margin:0 8px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-col :span="4">
        <el-badge :value="hasSelectedCount">
          <el-tag>已选试卷数</el-tag>
        </el-badge>
      </el-col>
    </el-row>

    <el-table
      :data="productBookList"
      v-loading="listLoading"
      sprite
      border
      highlight-current-row
      style="width: 100%; margin-top:10px"
    >
      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            class="el-icon-edit-outline"
            size="mini"
            @click.prevent="selectPaperOpen(row)"
            >选择</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        label="练习册"
        prop="testPaperCount"
        sortable
        align="left"
        min-width="300"
      >
        <template slot-scope="{ row }">
          <el-row>
            <el-col :span="4">
              <el-image
                style="width: 80px; height: 80px;"
                :src="baseURL + row.thumbnail_Small"
              ></el-image>
            </el-col>

            <el-col :span="20">
              <div class="homework-select-text">
                <nav class="Hwork-paper-name">{{ row.name }}</nav>
                <span>试卷数:{{ row.testPaperCount }}</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="出版社" min-width="140px" align="left">
        <template slot-scope="{ row }">
          <p>{{ row.publishingHouseName }}</p>
          <span class="Hwork-select-author"
            >作者:{{ row.author ? row.author : "未知" }}</span
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
      :page-sizes="[5, 10, 30, 50]"
    />

    <span slot="footer" class="dialog-footer">
      <!-- <el-button type="primary" @click="$emit('select-book-close')"
        >取消</el-button
      > -->
      <el-button type="primary" @click="summitBook">完成</el-button>
    </span>
    <select-paper
      v-if="isSelectPaper"
      :hasSelectedCount="hasSelectedCount"
      @updateSelectedCount="$emit('updateSelectedCount', $event)"
      :selectPaperVisivle="selectPaperVisivle"
      :productSerialNo="productSerialNo"
      v-bind="$attrs"
      @select-paper-close="selectPaperClose"
    />
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
import PaperList from "@/components/PaperList";
import selectPaper from "./selectPaper";
import { getProductBookList } from "@/api/book";
import { mapGetters } from "vuex";

export default {
  props: ["dialogPvVisible", "hasSelectedCount"],
  components: {
    Pagination,
    selectPaper,
    PaperList
  },
  computed: {
    ...mapGetters(["baseURL"])
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
      productBookList: [],
      listLoading: true,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 5
      },
      keyword: "",
      selectPaperVisivle: false,
      isSelectPaper: false,
      productSerialNo: "" //选择练习册
    };
  },
  methods: {
    initListQuery() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 5
      };
    },
    handleFilter() {
      this.listQuery.keyword = this.keyword;
      this.getList(this.listQuery);
    },
    async getList() {
      this.listLoading = true;
      const result = await getProductBookList(this.listQuery);
      if (result.error) {
        this.$message.error("请求错误");
      }
      console.log("获取练习册列表...", result.result);
      this.productBookList = result.result.productList;
      this.total = result.result.totalCount;

      setTimeout(() => {
        this.listLoading = false;
      }, 100);
    },
    handleClose(done) {
      this.$emit("select-book-close");
    },
    selectPaperOpen(book) {
      // console.log("选择练习册===", book);
      this.productSerialNo = book.serialNo;
      this.isSelectPaper = true;
      this.selectPaperVisivle = true;
    },
    selectPaperClose(selected) {
      if (selected) {
        console.log("确定", selected);
        this.$emit("select-book-close", selected);
      }
      this.selectPaperVisivle = false;
    },
    summitBook() {
      this.$emit("select-book-close");
    }
  }
};
</script>
<style lang="scss"></style>
