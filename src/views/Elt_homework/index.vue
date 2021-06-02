<template>
  <div class="app-container homework">
    <el-form
      :model="publishForm"
      ref="publishForm"
      label-width="100px"
      v-loading="formLoading"
      :rules="publishFormRules"
    >
      <el-row class="row-form-item">
        <el-form-item label="作业名称:" prop="jobPlanName">
          <el-input
            type="textarea"
            v-model="publishForm.jobPlanName"
          ></el-input>
          <el-tag type="info" class="tag-item homework-tag">
            <i class="el-icon-info"></i>
            可自定义填写作业名称，例如：4月1日英语作业
          </el-tag>
        </el-form-item>
      </el-row>

      <el-row class="row-form-item">
        <el-form-item label="作业备注:">
          <el-input type="textarea" v-model="publishForm.remarks"></el-input>
          <el-tag type="info" class="tag-item  homework-tag">
            <i class="el-icon-info"></i>
            可自定义填写作业备注，例如：请同学们按时完成作业
          </el-tag>
        </el-form-item>
      </el-row>

      <el-form-item label="选择试卷:" prop="testPaperList">
        <el-row class="row-form-item">
          <div class="select-paper">
            <el-button
              class="el-icon-edit-outline"
              @click.self="selectBookBtn"
            ></el-button>

            <el-tree
              :data="publishForm.testPaperList"
              :props="defaultProps"
              node-key="id"
              @node-click="handleNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="homework-paperlist-del">
                  <el-button
                    class="del-paper"
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="() => removePaper(node, data)"
                  >
                  </el-button>
                </span>
              </span>
            </el-tree>

            <el-tag type="info" class="tag-item homework-tag">
              <i class="el-icon-info"></i>
              可选择多份试卷
            </el-tag>
          </div>
        </el-row>
      </el-form-item>
      <!-- 选择试卷弹窗 -->
      <select-book
        v-if="dialogPvVisible"
        :hasSelectedCount="hasSelectedCount"
        @updateSelectedCount="updatehasSelectedCount"
        :dialogPvVisible="dialogPvVisible"
        v-bind="$attrs"
        @select-book-close="selectBookClose"
      />

      <el-form-item label="选择班级:" prop="selectClass">
        <el-row class="row-form-item">
          <div class="select-class">
            <!-- <el-button
              class="el-icon-edit-outline"
              @click.self="selectClassHandler"
            ></el-button> -->
            <el-select
              class="select-class-options homew-publishForm-input"
              v-model="publishForm.selectClass"
              placeholder="请选择班级"
              @change="getStudents"
            >
              <template v-for="(item, index) in classroomList">
                <el-option
                  :label="item.className"
                  :value="item.classId"
                  :key="index"
                ></el-option>
              </template>
            </el-select>
            <!-- 选择学生 -->
            <template v-if="publishForm.selectClass">
              <div>
                <el-button
                  class="el-icon-edit-outline"
                  @click.self="selectStuBtn"
                ></el-button>
                <!-- v-model="publishForm.users" -->
                <el-select
                  v-model="hasSelectStudent"
                  multiple
                  class="select-student-options homew-publishForm-input"
                  value-key="userId"
                  placeholder="请选择学生"
                  @change="selectStuChange"
                  :collapse-tags="true"
                >
                  <!-- 选项 -->
                  <el-option
                    style="height:40px;margin-top:2px;margin-bottom:2px"
                    v-for="item in classStuList"
                    :key="item.userId"
                    :value="item"
                    :label="
                      item.userName
                        ? item.userName + '(' + item.fullName + ')'
                        : item.fullName
                    "
                  >
                    <el-row type="flex" align="middle">
                      <el-avatar
                        style="margin-right:5px"
                        :src="baseURL + item.avatar_Middle"
                      ></el-avatar>
                      <span>
                        {{
                          item.userName
                            ? item.userName + "(" + item.fullName + ")"
                            : item.fullName
                        }}
                      </span>
                    </el-row>
                  </el-option>
                </el-select>
              </div>
            </template>
            <el-tag type="info" class="tag-item homework-tag">
              <i class="el-icon-info"></i>
              选择班级默认选择一个班级的学生，指定学生可自行选择班级中的学生
            </el-tag>
          </div>
        </el-row>
      </el-form-item>

      <!-- 选择学生弹窗 -->
      <select-student
        v-if="dialogStuVisible"
        :classroomId="publishForm.classroomId"
        :hasSelectStudent="hasSelectStudent"
        :dialogStuVisible="dialogStuVisible"
        v-bind="$attrs"
        @select-student="selectStuHandler"
        @select-student-close="selectStudentClose"
      />

      <el-row class="row-form-item">
        <el-form-item label="是否为乱序?">
          <el-switch
            v-model="publishForm.isQuestionChaos"
            class="homework-switch"
            @change="ChaosHandler"
          >
          </el-switch>
          <el-tag type="info" class="tag-item homework-tag">
            <i class="el-icon-info"></i>
            选择开启题目乱序后，每个学生的每一份试卷题目将打乱顺序
          </el-tag>
        </el-form-item>
      </el-row>

      <el-row class="row-form-item">
        <el-form-item label="时间范围:" prop="timeHorizon">
          <el-date-picker
            v-model="publishForm.timeHorizon"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectTimeHorizon"
          >
          </el-date-picker>

          <el-tag type="info" class="tag-item homework-tag">
            <i class="el-icon-info"></i>
            可自定义作业时间，提前布置学生端只有到了开始时间的时间点上，这份作业才会被显示
          </el-tag>
        </el-form-item>
      </el-row>

      <el-row class="row-form-item">
        <el-form-item label="布置人:" prop="arranger">
          <el-input
            v-model="publishForm.arranger"
            class="homework-arranger"
          ></el-input>
          <el-tag type="info" class="tag-item homework-tag">
            <i class="el-icon-info"></i>
            点击可修改，可自定义修改布置人的昵称
          </el-tag>
        </el-form-item>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm">确认布置</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 作业布置提示 -->
    <div class="block">
      <el-alert
        v-once
        v-if="description"
        :title="description"
        :closable="false"
        type="warning"
      ></el-alert>
    </div>

    <el-dialog
      top="40px"
      v-if="submitFormVisible"
      title="确认布置?"
      :visible.sync="submitFormVisible"
      width="30%"
    >
      <p>作业名称：{{ publishForm.jobPlanName }}</p>
      <p>已选试卷：{{ hasSelectedCount }}份</p>
      <p>
        布置人数：{{
          publishForm.users.length
            ? publishForm.users.length
            : classroomList.length
        }}
      </p>
      <p>是否题目乱序：{{ publishForm.isQuestionChaos ? "是" : "否" }}</p>
      <p>作业开始时间：{{ publishForm.timeHorizon[0] }}</p>
      <p>作业结束时间：{{ publishForm.timeHorizon[1] }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAgain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeploymentPublish,
  POSTdeployPublish,
  getClassroomList,
  getClassroomStuList
} from "@/api/publish";
import { getRecordDetails } from "@/api/record";

import selectBook from "./components/selectBook";
import Pagination from "@/components/Pagination";
import { arrUnique } from "@/utils";
import SelectStudent from "./components/selectStudent.vue";

import { mapGetters, mapState, mapActions } from "vuex";

export default {
  components: { Pagination, selectBook, SelectStudent },
  computed: {
    ...mapGetters(["baseURL"])
  },
  data() {
    return {
      // 获取上次编辑=门阀
      isOK: false,
      POST_testPaperList: [],
      classStuList: [], //学生列表
      publishForm: {
        jobPlanName: "", //作业名称
        remarks: "", //作业备注
        testPaperList: [], //选择试卷
        selectClass: "", //选择班级
        timeHorizon: [], //时间范围 startDateTime: 开始时间  endDateTime:结束时间
        isQuestionChaos: false, //是否题目乱序
        arranger: "", //作业布置人
        classroomId: "", //选择班级ID
        className: "",
        users: []
      },
      description: "",
      publishFormRules: {
        jobPlanName: [
          { required: true, message: "请输入作业名称", trigger: "blur" }
        ],
        testPaperList: [
          { required: true, message: "请选择试卷", trigger: "change" }
        ],
        selectClass: [
          { required: true, message: "请选择班级", trigger: "change" }
        ],
        timeHorizon: [
          {
            required: true,
            message: "请选择时间范围",
            trigger: "change"
          }
        ],
        arranger: [{ required: true, message: "请选择布置人", trigger: "blur" }]
      },
      hasSelectPaper: [],
      classroomList: [], //班级列表
      hasSelectStudent: "", // 选取指定学生
      ClassroomQuery: {
        pageIndex: 1,
        pageSize: 20
      },
      dialogPvVisible: false, //试卷弹窗
      dialogStuVisible: false, //学生弹窗
      formLoading: false,
      submitFormVisible: false, //再次确认布置
      paperPage: {
        subjectFilter: null,
        multipleSelection: [],
        showDialog: false,
        queryParam: {
          subjectId: null,
          level: null,
          paperType: 6,
          pageIndex: 1,
          pageSize: 5
        },
        listLoading: true,
        tableData: [],
        total: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      hasSelectedCount: "",
      defaultProps: {
        children: "paperList",
        label: "bookName"
      }
    };
  },
  created() {
    // 初始化
    this.initPage();
  },
  watch: {
    // 监听表单 存储最新的填写数据
    publishForm: {
      handler(n, o) {
        console.log("publishForm==新值==>", n);
        // console.log("publishForm==old值==>", o);
        localStorage.setItem("latestPublic", JSON.stringify(n));
      },
      deep: true
    },
    /**
     * 因element el-selection 组件问题
     * 选择指定学生另外存入一个数组，表单提交时 过滤数组 得到存入userId 的用户列表
     */
    hasSelectStudent(n, o) {
      localStorage.setItem("hasSelectStudent", JSON.stringify(n));
    }
  },
  methods: {
    latestPublish() {
      // 上一次编辑
      let latest = JSON.parse(localStorage.getItem("latestPublic"));
      let hasSelectStudent = JSON.parse(
        localStorage.getItem("hasSelectStudent")
      );

      console.log("latestPublic===", latest);
      if (latest) {
        this.publishForm = { ...latest };

        // 如果选中过班级
        if (this.publishForm.classroomId) {
          this.getStudents(this.publishForm.classroomId, "latest");
        }
        if (hasSelectStudent) {
          this.hasSelectStudent = hasSelectStudent;
        }
        // 清空时间
        this.publishForm.timeHorizon = [];
        console.log(this.publishForm);
      }
    },
    localPaper() {
      return JSON.parse(localStorage.getItem("hasSelectPaper")) || [];
    },
    savePaper(arr) {
      this.updatehasSelectedCount(arr.length);
      return localStorage.setItem("hasSelectPaper", JSON.stringify(arr));
    },
    async initPage() {
      this.isOK = false;
      // 上次编辑的记录回显
      this.latestPublish();

      // 获取本地已选试卷
      this.getLocalHasSelect();
      // 获取班级列表
      await this.getClassList();
      // 获取发布作业
      await this.getDeployPublish();

      // 重新布置作业时 根据路由传入 scheduleId 进行重新布置
      let scheduleId = this.$route.query.scheduleId;

      if (scheduleId) {
        console.log(scheduleId);
        // 重新布置作业
        this.rePublish(scheduleId);
      }
    },
    getLocalHasSelect() {
      // 获取本地已选择试卷
      let local = this.localPaper();
      this.publishForm.testPaperList = local;
      console.log("获取本地已选试卷", this.publishForm.testPaperList);
      // 本地已选试卷数显示
      if (local) {
        this.hasSelectedCount = local.length;
        // console.log("获取本地已选试卷数", this.hasSelectedCount);
        this.formaterSelection(local);
      }
    },
    async getClassList() {
      // ClassroomQuery 查询班级列表 1页 20条
      const { result, success, error } = await getClassroomList(
        this.ClassroomQuery
      );
      if (success) {
        console.log("获取班级列表", result);
        this.classroomList = result.classroomList;
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    async getDeployPublish() {
      // 获取发布作业
      const { result, success, error } = await getDeploymentPublish();
      console.log("获取作业发布", result);
      if (success) {
        this.publishForm.arranger = result.arranger;
        // 重置时间
        this.publishForm.timeHorizon.push(
          result.startDateTime,
          result.endDateTime
        );
        // 重置发布描述
        this.description = result.description;
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    async rePublish(scheduleId) {
      // 重新佈置作業
      console.log(this.publishForm);

      const { result, success, error } = await getRecordDetails({ scheduleId });
      console.log("重新发布作业获取详情==>", result);
      // let data = result;
      if (success) {
        // 根据作业id 重新赋值回 publishForm
        this.publishForm.arranger = result.arranger;
        this.publishForm.jobPlanName = result.jobPlanName;
        this.publishForm.remarks = result.remarks;

        console.log(this.publishForm.users);
        console.log("res.testPaperList", result.testPaperList);
        this.formaterSelection(result.testPaperList);

        // 班级是否解散
        console.log("班级列表", this.classroomList);
        let isExitClass = this.classroomList.findIndex(
          i => i.classId === result.classId
        );
        console.log(isExitClass);
        if (isExitClass != -1) {
          this.publishForm.selectClass = result.classId;
          this.publishForm.classroomId = result.classId;
          this.classStuList = result.studentList;
          this.publishForm.users = this.classStuList.map(i => i.userId);
        } else {
          this.$message({
            message: "原班级已解散,请重新选择班级、指定学生",
            type: "warning"
          });
          this.publishForm.selectClass = "";
          this.publishForm.classroomId = "";
          this.publishForm.users = [];
        }
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    handleNodeClick(data) {
      // node-click 树状图
      // console.log(data);
    },
    selectBookBtn() {
      // 点击进入选择练习册页面
      console.log("选择练习册");
      this.dialogPvVisible = true;
    },
    selectBookClose(selected) {
      // 关闭选择书籍
      console.log("get--selected", selected);
      // 选择完成
      if (selected) {
        this.formaterSelection(selected);

        console.log("选择==>", selected);

        let hasSelect = this.localPaper();
        console.log("已选", hasSelect);
        // 已存在
        if (hasSelect) {
          let oldArr = [];
          hasSelect.map(i => oldArr.push(i.testPaperSerialNo));
          // console.log("已选试卷", oldArr);
          this.savePaper(hasSelect);

          return;
        }
        this.savePaper(selected);
      } else {
        this.dialogPvVisible = false;
      }
    },
    updatehasSelectedCount(val) {
      console.log("---已选试卷数", val);
      this.hasSelectedCount = val;
    },
    async getStudents(id, verify) {
      // 选择班级
      console.log("班级", id);
      this.publishForm.classroomId = id;
      this.classStuList = [];
      this.publishForm.users = [];

      const { result, success, error } = await getClassroomStuList({
        classId: id
      });
      if (success) {
        // 更新选择的班级
        this.classStuList = result.users;
        if (!verify) {
          // 没有验证则为 指定学生重置
          // 有传入verify则为本地已选学生无需重置
          this.hasSelectStudent = "";
        }
        console.log(this.publishForm.users);
      }
      if (error) {
        this.$message.error(error.message);
      }
    },
    selectStuBtn() {
      // 指定学生按钮
      console.log("选择指定学生");
      this.dialogStuVisible = true;
    },
    selectStuHandler(val) {
      // 弹窗选择指定学生
      console.log("弹窗选择指定学生", val);

      this.$nextTick(() => {
        // 处理选中的学生提取userId
        this.hasSelectStudent = val;
        this.publishForm.users = val.map(i => {
          return i.userId;
        });
        console.log(this.publishForm.users);
      });
    },
    selectStudentClose(val) {
      if (val) {
        let userId = [];
        val.map(i => userId.push(i.userId));
        this.$nextTick(() => {
          this.publishForm.users = userId;
        });
      }
      this.dialogStuVisible = false;
    },
    ChaosHandler() {
      // change 查看是否乱序
      console.log("乱序？", this.publishForm.isQuestionChaos);
    },
    selectTimeHorizon() {
      // console.log(this.publishForm.timeHorizon);
    },
    selectStuChange(val) {
      // 组件绑定 this.publishForm.users
      // 值自动存入数组中
      console.log("已选学生", val);
      console.log("hasSelectStudent", this.hasSelectStudent);
      console.log("classStuList", this.classStuList);

      // this.hasSelectStudent.
      // 处理选中的学生提取userId
      this.publishForm.users = val.map(i => {
        return i.userId;
      });
      console.log("publishForm", this.publishForm.users);
    },
    removePaper(node, data) {
      const parent = node.parent;
      const children = parent.data.paperList || parent.data;
      let removeItem;
      let currentRemoveId;
      const index = children.findIndex(d => {
        // console.log(d.testPaperId);
        // console.log(data.testPaperId);
        if (d.testPaperId === data.testPaperId) {
          removeItem = d;
        }
        return d.testPaperId === data.testPaperId;
      });
      children.splice(index, 1);
      let localPaper = this.localPaper();

      if (removeItem.testPaperId) {
        // 删除练习册内试卷
        currentRemoveId = removeItem.testPaperId;
        localPaper = localPaper.filter(
          i => !(i.testPaperId === currentRemoveId)
        );
      } else {
        // 删除整份练习册
        currentRemoveId = removeItem.bookName;
        localPaper = localPaper.filter(
          i => !(i.productName === currentRemoveId)
        );
      }
      console.log(currentRemoveId);

      // 重新缓存试卷
      this.savePaper(localPaper);
      console.log("删除后", localPaper);
    },
    submitForm() {
      let _this = this;
      console.log("publishForm", this.publishForm);

      this.$refs.publishForm.validate(valid => {
        if (valid) {
          // this.formLoading = true;
          // console.log("POST_testPaperList", this.POST_testPaperList);

          this.submitFormVisible = true;
        } else {
          return false;
        }
      });
    },
    resetForm() {
      console.log(this.$refs.publishForm);
      // 重置清空
      this.$refs.publishForm.resetFields();
      // 重新拉取布置作业
      this.getDeployPublish();
    },
    submitAgain() {
      let obj = {};
      obj = {
        jobPlanName: this.publishForm.jobPlanName,
        testPaperList: this.POST_testPaperList,
        classroomId: this.publishForm.classroomId,
        users: this.publishForm.users,
        isQuestionChaos: this.publishForm.isQuestionChaos,
        startDateTime: this.publishForm.timeHorizon[0],
        endDateTime: this.publishForm.timeHorizon[1],
        arranger: this.publishForm.arranger,
        remarks: this.publishForm.remarks
      };
      console.log(obj);
      console.log(this.POST_testPaperList);
      POSTdeployPublish(obj)
        .then(result => {
          if (result) {
            this.$message({
              showClose: true,
              message: "布置作业成功",
              type: "success"
            });
            // this.formLoading = false;
            this.$router.push("/record");
            return;
          }
          this.$message({
            showClose: true,
            message: result.error.message || "布置作业失败!!",
            type: "error"
          });
          this.submitFormVisible = false;
        })
        .catch(err => new Error(err));
      console.log(obj);
    },

    formaterSelection(testPaperList) {
      var nameContainer = {}; // 针对键name进行归类的容器
      // 根据el-tree处理数组
      testPaperList.forEach(item => {
        nameContainer[item.productName] = nameContainer[item.productName] || [];
        nameContainer[item.productName].push(item);
      });

      var productList = Object.keys(nameContainer);

      let newSelectedPaper = [];

      productList.forEach(nameItem => {
        let paperList = [];
        nameContainer[nameItem].forEach(item => {
          paperList.push({
            bookName: item.testPaperDisplayName || item.testPaperName,
            productId: item.productId,
            testPaperId: item.testPaperId,
            testpaperSerialNo: item.testPaperSerialNo,
            bookSerialNo: item.serialNo
          });
          // 提取post提交的testPaperList
          this.POST_testPaperList.push({
            productId: item.productId,
            testPaperId: item.testPaperId
          });
        });
        newSelectedPaper.push({
          bookName: nameItem,
          paperList: paperList
        });
      });
      this.publishForm.testPaperList = newSelectedPaper;
      console.log("formated!!", this.publishForm.testPaperList);
    },
    filterSameBook() {
      var obj = {};
      $.each(data, function(key, val) {
        var objArray = obj[val.kpi] || [];
        objArray.push(val);
        obj[val.kpi] = objArray;
      });
    },
    pickupPaperID(arr) {
      arr.map(item => {
        item.paperList.every(i => i.testPaperId);
      });
    }
  }
};
</script>
<style lang="scss">
.homework {
  [class^="select-"] {
    display: flex;
    .el-select {
      width: 100%;
    }
  }
  .row-form-item {
    .el-form-item__content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .el-textarea {
        width: 500px;
      }
    }
    .select-paper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .el-tree__empty-block {
        min-width: 160px;
      }
    }
    .select-class {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .select-class-options {
        margin: 5px;
        margin-left: 0;
      }
      .select-student-options {
        color: red;
        background: lightblue;
      }
    }
    // .el-select {
    .homew-publishForm-input {
      width: 460px;
    }
    .homework-switch {
      padding-top: 5px;
      margin-right: 460px;
    }
    .el-date-editor {
      width: 500px;
    }
    .homework-arranger {
      width: 500px;
    }
  }

  .homework-tag {
    border: none;
    background: none;
    padding-right: 0;
  }

  .el-icon-edit-outline {
    background: #409eff;
    width: 40px;
    padding-left: 12px;
    color: #fff;
  }
  // 树状(选择试卷)
  .custom-tree-node {
    display: flex;
    min-width: 400px;
  }
  .homework-paperlist-del {
    flex: 1;
    text-align: right;
    .del-paper {
      padding: 5px;
      color: red;
    }
  }
  .reset-btn {
    margin-right: 10px;
  }
}
</style>
