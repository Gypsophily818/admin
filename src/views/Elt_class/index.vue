<template>
  <div class="tab-container">
    <el-row type="flex" justify="end" align="middle" style="margin-top:-15px">
      <!-- 选择班级 -->
      <el-col>
        班级：<el-select v-model="selected" @change="handleFilterCategory">
          <el-option
            v-for="(item, index) in classList"
            :key="index"
            :label="item.className + ' ( ' + item.classSize + '人 ) '"
            :value="item.classId"
          />
        </el-select>
      </el-col>

      <el-button
        v-if="ClassOfAll.allowCreationOfClasses"
        class="pan-btn green-btn"
        icon="el-icon-plus"
        @click="createClassHandler"
      >
        创建班级
      </el-button>

      <!--  新建班级弹窗 -->
      <el-dialog
        v-if="createClassDialogVisible"
        title="创建班级"
        :visible.sync="createClassDialogVisible"
        width="55%"
        top="40px"
        :before-close="createClassHandleClose"
      >
        <el-form
          :model="newClassForm"
          ref="newClassForm"
          class="demo-ruleForm"
          :rules="newClassFormRules"
        >
          <!-- <el-input
                  type="text"
                  v-model.number="newClassForm.className"
                ></el-input> -->
          <el-form-item prop="className">
            <el-row
              type="flex"
              :gutter="20"
              justify="left"
              style="margin-top:-20px;margin-bottom:-10px"
            >
              <el-col :span="12">
                <el-input
                  type="text"
                  placeholder="请输入新班级名称"
                  v-model="newClassForm.className"
                ></el-input>
              </el-col>

              <el-col :span="12">
                <el-button
                  size="medium"
                  v-if="isEmpty"
                  @click="isEmpty = !isEmpty"
                >
                  从机构中添加
                </el-button>
                <el-badge
                  :value="newClassForm.userIdList.length"
                  class="item"
                  v-else
                >
                  <el-tag>已选班级人数</el-tag>
                </el-badge>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <EtnTeamMember
          v-if="!isEmpty"
          @chooseMemberUserIdList="getChooseMemberUserIdList"
        />

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm('newClassForm')"
            >确认创建</el-button
          >
        </span>
      </el-dialog>
    </el-row>

    <el-row v-if="selected">
      <!-- :classId="selected" -->
      <class-Tab @reload="reloadHandler" :ClassOfAll="ClassOfAll" />
    </el-row>
  </div>
</template>

<script>
import EtnTeamMember from "@/components/EtnTeamMember";
import TabPane from "./components/TabPane";
import ClassTab from "./class-tab";
import {
  postCreateClass,
  getClassIndex,
  getClassroomList,
  getTeamOfMemberList
} from "@/api/class";

export default {
  name: "Class",
  components: { EtnTeamMember, TabPane, ClassTab },
  data() {
    let checkClassName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("班级名称不能为空"));
      } else {
        let isExitClass = this.classList.find(i => {
          return i.className === value;
        });
        if (isExitClass) {
          callback(new Error("班级已存在,请换一个班级名称!"));
        } else {
          callback();
        }
      }
    };
    return {
      classList: null, //班级下拉选择
      activeClass: "",
      classIndex: {
        classId: "",
        keyword: ""
      },
      ClassOfAll: "", //当前班级所有信息
      // 创建班级
      isEmpty: true, // 空班级,只有名称,不直接添加人数
      createClassDialogVisible: false,
      newClassForm: {
        className: "",
        userIdList: []
      },
      // 表单验证
      newClassFormRules: {
        className: [{ validator: checkClassName, trigger: "blur" }]
      },
      selected: "", //选择班级
      studentList: null,
      teacherList: null
    };
  },
  watch: {
    activeClass() {
      this.$router.push(
        `${this.$route.path}?className=${this.activeClass.className}&classId=${this.activeClass.classId}`
      );
    }
  },
  created() {
    this.getClass();
    console.log(this.activeClass);
  },
  methods: {
    handleFilterCategory(val) {
      console.log("选择班级", val);
      // this.classId = val;
      this.getClass(val);
    },
    createClassHandler() {
      this.createClassDialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const _DATA = await postCreateClass(this.newClassForm);
          console.log("创建班级", _DATA);
          if (_DATA.success) {
            this.$message({
              message: "创建成功!",
              type: "success"
            });
            setTimeout(() => {
              location.reload();
            }, 500);
          }
          if (_DATA.error) {
            this.$message.error(_DATA.error.message);
          }
          this.createClassDialogVisible = false;
          this.$refs.newClassForm.clearValidate();
        } else {
          return false;
        }
      });
    },
    createClassHandleClose(done) {
      this.isEmpty = true;
      this.$refs.newClassForm.clearValidate();
      done();
    },
    cancel() {
      this.createClassDialogVisible = false;
      this.$refs.newClassForm.clearValidate();
    },
    reloadHandler(id) {
      console.log("iiiidddd", id);
      this.getClass(id || "");
    },
    async getClass(id) {
      this.classIndex.classId = id;
      const res = await getClassIndex(this.classIndex);
      if (res.success) {
        let result = res.result;
        console.log("result==", result);
        this.classList = result.classList;
        console.log("new==id", id);
        console.log("ClassIndex", res);
        // console.log("获取班级列表", this.classList);
        let currentSelected = this.classList.filter(i => {
          return i.isSelected;
        });
        console.log("activeClass", currentSelected);
        this.activeClass = currentSelected[0];
        this.selected = currentSelected[0].classId;
        // this.currentClass = result.currentClass;

        // 当前班级所有信息
        this.ClassOfAll = result;
      }
      if (res.error) {
        this.$message.error(res.error.message);
      }
    },
    getChooseMemberUserIdList(list) {
      this.newClassForm.userIdList = list;
    }
  }
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
