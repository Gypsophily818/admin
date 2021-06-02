<template>
  <div style="padding: 10px 0 0 0" v-if="ClassOfAll">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <class-card @reload="successSetting" :ClassOfAll="ClassOfAll" />
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
    // el-tag类型 显示转换
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
      activeTab: "student"
    };
  },
  created() {},
  watch: {},
  methods: {
    successSetting(id) {
      console.log("更改成功==class-tab", id);
      this.$emit("reload", id || "");
      this.$refs.student.getList();
      this.$refs.teacher.getList();
    }
  }
};
</script>
<style lang="scss" scoped></style>
