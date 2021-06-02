<template>
  <div style="padding: 10px 0 0 0" v-if="ClassOfAll">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <class-card
          :classInfo="classInfo"
          @reload="successSetting"
          :ClassOfAll="ClassOfAll"
        />
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="'学生管理 ( ' + ClassOfAll.studentList.length + '人)'"
              name="student"
            >
              <student
                ref="student"
                :classId="ClassOfAll.currentClass.classId"
                :currentClass="ClassOfAll.currentClass"
                @reload="successSetting"
              />
            </el-tab-pane>
            <el-tab-pane
              :label="'教师管理 ( ' + ClassOfAll.teacherList.length + '人)'"
              name="teacher"
            >
              <teacher
                ref="teacher"
                :classId="ClassOfAll.currentClass.classId"
                :currentClass="ClassOfAll.currentClass"
                @reload="successSetting"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ClassCard from "./ClassCard";
import Student from "./Student";
import Teacher from "./Teacher";

import { getClassInfo, getMemberList } from "@/api/class";
import { mapGetters } from "vuex";

export default {
  // props: ["classId", "classList", "currentClass"],
  props: ["ClassOfAll"],
  components: {
    ClassCard,
    Student,
    Teacher
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  filters: {
    //  el-tag类型 显示转换
    // [1=Manage(管理员)],[2=System(系统)],[3=Member(学员)],[4=Teacher(教师)],[5=Business(机构)]
    // [6=Finance(财务)],[7=Teller(出纳)],[8=Partner(股东)],[9=Dealer(经销商)]
    statusFilter(status) {
      const statusMap = {
        1: "danger",
        2: "danger",
        3: "info",
        4: "success",
        5: "danger",
        6: "",
        7: "",
        8: "warning",
        9: ""
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      classInfo: null,
      memberList: [],
      listQuery: {
        classId: this.classId,
        type: 0,
        keyword: ""
      },
      total: 0,
      loading: false,
      searchKeyword: "",
      addMemberVisible: false, // 添加成员抽屉
      settingClassVisible: false, // 班级设置抽屉
      activeTab: "student"
      // studentCount: "",
      // teacherCount: ""
    };
  },
  created() {
    console.log("class-tab", this.classId);
    // this.getList();
  },
  watch: {
    searchKeyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    },
    classId(n, o) {
      console.log("classTab==classId更新", n);
      this.classId = n;
      this.listQuery.classId = n;
      this.getList(this.listQuery);
    }
  },
  methods: {
    initListQuery() {
      this.listQuery.keyword = "";
    },
    async getList() {
      this.loading = true;
      const info = await getClassInfo({ classId: this.classId });
      const memberList = await getMemberList(this.listQuery);
      if (info.success || memberList.success) {
        console.log("classInfo===班级信息", info.result);
        console.log("memberList===成员列表", memberList.result);
        this.classInfo = info.result;
        this.memberList = memberList.result.members;
        this.loading = false;
      }

      if (info.error || memberList.error) {
        this.$message.error(info.error.message);
      }
    },
    // clickTabHandler(tab, event) {
    //   console.log(tab, event);
    //   console.log(tab.label);
    //   if (tab.label == "学生管理") {
    //     this.studentManage();
    //   } else {
    //     this.teacherManage();
    //   }
    // },
    teacherManage() {
      console.log("学生管理");
      this.listQuery.type = 1;
      this.getList();
    },
    studentManage() {
      console.log("教师管理");
      this.listQuery.type = 0;
      this.$nextTick(() => {
        this.getList();
      });
    },
    handleFilter() {
      this.listQuery.keyword = this.searchKeyword;
      this.getList();
    },
    addMemberHandler() {
      console.log("打开添加班级抽屉", this.classInfo);

      this.addMemberVisible = true;
    },
    settingClassHandler() {
      console.log("打开班级设置抽屉", this.classInfo);

      this.settingClassVisible = true;
    },
    successSetting(id) {
      console.log("更改成功==class-tab", id);
      this.$emit("reload", id || "");
      // if (id) {
      //   this.getList(id);
      // }
      this.getList();
      this.$refs.student.getList();
      this.$refs.teacher.getList();
    }
    // getStudentCount(val) {
    //   this.studentCount = val;
    // },
    // getTeacherCount(val) {
    //   this.teacherCount = val;
    // }
  }
};
</script>
<style lang="scss" scoped></style>
