<template>
  <el-dialog
    :visible.sync="selectPaperVisivle"
    append-to-body
    title="选择试卷"
    :before-close="handleClose"
    width="80%"
    top="40px"
    class="select-book"
  >
    <el-row type="flex" align="middle" style="margin-top:-25px">
      <el-col :span="6">
        <el-input
          v-model.trim="keyword"
          placeholder="请输入试卷名称"
          style=""
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
      ref="multipleTable"
      :data="productPaperList"
      v-loading="listLoading"
      sprite
      border
      highlight-current-row
      style="width: 100%; margin-top:10px"
      :row-key="getRowKeys"
      @select="selectHandler"
      @row-click="clickHandler"
      @select-all="selectAll"
    >
      <el-table-column
        type="selection"
        label="全选"
        width="100px"
        align="center"
        :reserve-selection="true"
      >
      </el-table-column>

      <el-table-column
        label="试卷名称"
        prop="questionsCount"
        sortable
        align="left"
        min-width="300"
      >
        <template slot-scope="{ row }">
          <div class="homework-select-icon">
            <div class="homework-select-text">
              <p>{{ row.testPaperDisplayName }}</p>
              <span>包含试题个数:{{ row.questionsCount }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="试卷要求" min-width="140px" align="left">
        <template slot-scope="{ row }">
          <p>{{ gobalName.Paper_RCorrect }}:{{ row.requireFinishedRate }}</p>
          <span class="Hwork-select-author"
            >要求完成时长:{{ row.requireFinishedDuration }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click.stop="handleDetail(row)"
            >查看</el-button
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
      :page-sizes="[7, 20, 30, 50]"
    />

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="summitPaper">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getProductBookItem } from "@/api/book";
import { arrUnique } from "@/utils";
import { mapGetters } from "vuex";

export default {
  props: ["selectPaperVisivle", "productSerialNo", "hasSelectedCount"],
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(["baseURL", "gobalName", ""])
  },
  created() {
    this.listQuery.productSerialNo = this.productSerialNo;
    this.getList();
  },
  watch: {
    keyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    },
    productSerialNo(new_productSerialNo, o) {
      console.log("切换练习册", new_productSerialNo);
      this.listQuery.productSerialNo = new_productSerialNo;
      this.getList();
    }
  },
  data() {
    return {
      productPaperList: [],
      listLoading: true,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 7
      },
      keyword: "",
      multipleSelection: [],
      hasSelection: [], //本地试卷
      lastTimeArr: []
    };
  },
  methods: {
    localPaper() {
      return JSON.parse(localStorage.getItem("hasSelectPaper")) || [];
    },
    savePaper(arr) {
      this.$emit("updateSelectedCount", arr.length);
      return localStorage.setItem("hasSelectPaper", JSON.stringify(arr));
    },
    getRowKeys(row) {
      return row.testPaperSerialNo;
    },
    toggleSelection(arr) {
      // 传入每次获取到的新试卷列表与已选择的试卷对比
      let selected = this.localPaper();
      let arrId = [];
      selected.map(i => arrId.push(i.testPaperSerialNo));
      if (selected) {
        let arrFilter = arr.filter(
          i => arrId.indexOf(i.testPaperSerialNo) !== -1
        );
        console.log("反显==toggleSelection", arrFilter);
        return arrFilter;
      }
    },
    handleFilter() {
      this.listQuery.keyword = this.keyword;
      this.getList(this.listQuery);
    },
    async getList() {
      this.listLoading = true;
      const result = await getProductBookItem(this.listQuery);
      if (result.error) {
        this.$message.error("请求错误");
      }
      // console.log("获取试卷列表...", result.result);
      this.productPaperList = result.result.testPaperList;
      this.total = result.result.totalCount;

      // 初始化--是否已选择
      if (this.localPaper().length) {
        console.log("初始化--已选择", this.localPaper());
        // 本地已选试卷
        this.hasSelection = this.localPaper();
        // 当前页展示的所有试卷
        let rows = this.toggleSelection(this.productPaperList);
        // 反显
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }

      setTimeout(() => {
        this.listLoading = false;
      }, 100);
    },
    handleClose(done) {
      this.$emit("select-paper-close");
    },
    summitPaper() {
      if (this.localPaper) {
        console.log("确定选择...multipleSelection本次", this.localPaper());
        this.$emit("select-paper-close", this.localPaper());
      }
      this.$emit("select-paper-close");
    },
    selectAll(selection) {
      let local = this.localPaper();
      if (selection.length !== 0) {
        selection.map(i => {
          console.log(local);
          local.push(i);
          local = arrUnique(local, "testPaperSerialNo");
          this.savePaper(local);
        });
      } else {
        console.log(222);
        this.productPaperList.map(i => {
          console.log(i);
          local = local.filter(item => !(item.testPaperId === i.testPaperId));
          this.savePaper(local);
          return local;
        });
      }
    },
    selectHandler(selection, row) {
      console.log("selectHandler", selection);
      row = this.initLocalPaper(row);

      this.paperStorageHandler(row);
    },
    clickHandler(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
      this.hasSelection = [];

      row = this.initLocalPaper(row);
      this.paperStorageHandler(row);
    },
    paperStorageHandler(row) {
      let local = this.localPaper();
      console.log("已存入本地", local);
      if (local.length > 0) {
        let isExit = local.find(i => {
          return i.testPaperId === row.testPaperId;
        });
        console.log("本地存在==>", isExit);
        if (isExit) {
          local = local.filter(i => !(i.testPaperId === row.testPaperId));
          console.log("删除完成==>", local);
          this.savePaper(local);
          return local;
        }
        local.push(row);
        console.log("新增", row);
        local = arrUnique(local, "testPaperSerialNo");

        this.savePaper(local);
        // console.log("本地已有");
        console.log("过滤后", local);
        return;
      }
      this.hasSelection.push(row);
      console.log("本次存入", this.hasSelection);
      this.savePaper(this.hasSelection);
    },
    handleDetail(val) {
      console.log("查看试卷", val);
    },
    initListQuery() {
      this.listQuery = {
        productSerialNo: "",
        pageIndex: 1,
        pageSize: 7
      };
    },
    initLocalPaper(obj) {
      let setArr = [];

      if (Array.isArray(obj)) {
        console.log("initLocalPaper==数组");
        let object = {
          productId: "",
          productName: "",
          testPaperId: "",
          testPaperName: "",
          testPaperDisplayName: "",
          testPaperSerialNo: ""
        };
        obj.map(item => {
          for (const key in object) {
            object[key] = item[key];
          }
          setArr.push({ serialNo: this.productSerialNo, ...object });
        });
      } else {
        console.log("initLocalPaper==对象");
        let object = {
          serialNo: this.productSerialNo,
          productId: obj.productId,
          productName: obj.productName,
          testPaperId: obj.testPaperId,
          testPaperName: obj.testPaperName,
          testPaperDisplayName: obj.testPaperDisplayName,
          testPaperSerialNo: obj.testPaperSerialNo
        };
        // setArr.push(object);
        return object;
      }
      return setArr;
    }
  },
  mounted() {}
};
</script>
<style lang="scss"></style>
