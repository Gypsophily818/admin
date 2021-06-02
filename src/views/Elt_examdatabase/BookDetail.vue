<template>
  <div class="app-container">
    <el-collapse v-model="activeNames" @change="oooo">
      <el-collapse-item name="exam-book">
        <template slot="title">
          <div class="exam-book-title">
            <el-image
              v-if="details.thumbnail_Small && !isOpen"
              style="width: 48px;"
              :src="baseURL + details.thumbnail_Small"
            ></el-image>
            <template v-if="details.thumbnail_Small && !isOpen">
              <i class="el-icon-caret-right" />
            </template>
            <template v-else>
              <i class="el-icon-caret-bottom" />
            </template>

            <span class="pan-btn green-btn bookBtn">{{ details.name }}</span>
          </div>
        </template>

        <el-row>
          <el-col>
            <el-card
              :body-style="{ padding: '0px' }"
              v-if="details"
              class="book-face-wrapper"
            >
              <template>
                <div class="image" v-if="details.thumbnail_Small">
                  <img :src="baseURL + details.thumbnail_Small" />
                </div>

                <div class="hasno-img" v-else>暂时无图</div>
              </template>

              <div style="padding: 14px;padding-left:0">
                <span
                  ><b>{{ details.name }}</b></span
                >
                <div class="bookDetail-author">{{ details.author }}</div>
                <div class="bookDetail-author" v-if="details.viewingCount">
                  {{ details.viewingCount }}人浏览
                </div>
                <div v-else><b>请先到题库选择练习册~</b></div>
                <template
                  v-if="
                    details.isHot ||
                      details.isDiscount ||
                      details.isOriginal ||
                      details.isRecommand
                  "
                >
                  <el-tag
                    v-if="details.publishingHouseShortName"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    style="border:1px solid #ff4949;background:#ff4949;color:#fff"
                    >{{ details.publishingHouseShortName }}</el-tag
                  >

                  <el-tag
                    v-if="details.isHot"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    >热门</el-tag
                  >
                  <el-tag
                    v-if="details.isDiscount"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    >促销</el-tag
                  >
                  <el-tag
                    v-if="details.isOriginal"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    >原创</el-tag
                  >
                  <el-tag
                    v-if="details.isRecommand"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    >推荐</el-tag
                  >
                  <el-tag
                    v-if="details.isNew"
                    type="danger"
                    class="book-list-tag bookDetail-tag"
                    >新品</el-tag
                  >
                </template>
                <div class="bookDetail-author">
                  {{ details.publishingHouseName }}
                </div>
                <div
                  class="bottom clearfix description"
                  v-if="details.description"
                >
                  <header class="content-title"><b>内容介绍</b></header>
                  <p class="content">{{ details.description }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <!-- 可封装全局成<paper-list>组件 -->
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
      fit
      stripe
      highlight-current-row
      style="width: 100%;margin-top:15px"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="试卷名称" min-width="200px" align="left">
        <template slot-scope="{ row }">
          <el-tag class="bookDetailPaper-tag">
            {{ row.testPaperRequireTypeName }}
          </el-tag>
          <span class="bookDetailPaper-name">{{
            row.testPaperDisplayName
              ? row.testPaperDisplayName
              : row.testPaperName
          }}</span>
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
      :page-sizes="[8, 20, 30, 50]"
      @pagination="getDetailList"
    />
  </div>
</template>
<script>
import { getProductBookItem } from "@/api/book";
import Pagination from "@/components/Pagination";
import { mapGetters } from "vuex";
export default {
  name: "BookDetail",
  computed: {
    ...mapGetters(["baseURL"])
  },
  components: {
    Pagination
  },
  created() {
    console.log("created", this.$route.query);
    const { pageIndex, pageSize, productSerialNo } = this.$route.query;
    let index = pageIndex * 1;
    let size = pageSize * 1;
    if (productSerialNo) {
      this.getDetail(index, size, productSerialNo);
    }
  },
  activated() {
    console.log("activated==>", this.$route.query);
  },
  watch: {
    $route(n, o) {
      if (n) {
        const { pageIndex, pageSize, productSerialNo } = this.$route.query;
        let index = pageIndex * 1;
        let size = pageSize * 1;
        if (productSerialNo) {
          this.getDetail(index, size, productSerialNo);
        }
      }
    },
    keyword(n, o) {
      if (n === "") {
        this.handleFilter();
      }
    }
  },
  data() {
    return {
      details: {},
      paperList: [],
      listQuery: {
        pageIndex: 0,
        pageSize: 10
      },
      keyword: "",
      listLoading: true,
      total: 0,
      activeNames: ["exam-book"],
      isOpen: true
    };
  },
  methods: {
    getDetail(index, size, id) {
      this.listLoading = true;
      this.formatListQuery(index, size, id);

      getProductBookItem(this.listQuery)
        .then(result => {
          console.log("书籍详情", result);

          this.details = result.result.bookDetail;
          this.paperList = result.result.testPaperList;
          this.total = result.result.totalCount;
          console.log("listQuery==>", this.listQuery);
          console.log("paperList==>", this.paperList);

          this.listLoading = false;
        })
        .catch(err => {});
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    },
    handleFilter() {
      console.log(this.keyword);
      this.listQuery.keyword = this.keyword;
      this.getDetailList(this.listQuery);
    },
    async getDetailList() {
      this.listLoading = true;

      const detail = await getProductBookItem(this.listQuery);

      this.details = detail.result.bookDetail;
      this.paperList = detail.result.testPaperList;
      this.total = detail.result.totalCount;
      console.log("paperList", detail.result.testPaperList);

      this.listLoading = false;
    },
    formatListQuery(index, size, id) {
      this.listQuery.pageIndex = index;
      this.listQuery.pageSize = size;
      this.listQuery.productSerialNo = id;
    },
    async handleDetail(paper) {
      console.log("查看试卷", paper);

      this.$router.push({
        path: "/examdatabase/paperDetail",
        query: { paper }
      });
    },
    oooo(isopen) {
      isopen[0] ? (this.isOpen = true) : (this.isOpen = false);
    }
  }
};
</script>

<style lang="scss">
.exam-book-title {
  display: flex;
  justify-content: center;
  align-items: center;
  .bookBtn {
    height: 30px;
    line-height: 0px;
  }
}
.book-face-wrapper {
  .el-card__body {
    display: flex;
    .image {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
    .hasno-img {
      background: #ccc;
      text-align: center;
      line-height: 240px;
      height: 100%;
      min-width: 240px;
      margin-right: 10px;
    }
    .bookDetail-author {
      font-size: 14px;
      margin: 10px 0;
    }
    .bookDetail-tag {
      margin-right: 5px;
    }
    .description {
      .content-title {
        margin-bottom: 8px;
        text-align: center;
      }
      .content {
        font-size: 14px;
        margin: 0;
        padding: 0;
      }
    }
  }
  .paper-wrapper {
    .list {
      background: lightpink;
      width: 500px;
      height: 400px;
    }
  }
}
.bookDetailPaper-tag {
  background: #1890ff;
  color: #fff;
  padding: 0 4px;
}
.bookDetailPaper-name {
  margin-left: 5px;
}
</style>
