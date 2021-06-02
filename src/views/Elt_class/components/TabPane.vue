<template>
  <div style="padding: 10px 0 0 0">
    <el-row>
      <el-card class="box-card" v-if="classInfo">
        <div slot="header" class="clearfix">
          <el-row style="margin-bottom: 10px;">
            <nav>{{ classInfo.className }}</nav>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-row type="flex" align="middle">
                <span style="margin-right: 8px;">班主任:</span>
                <el-avatar
                  v-if="classInfo.avatar_Middle"
                  size="medium"
                  :src="baseURL + classInfo.avatar_Middle"
                  style="margin-right: 8px;"
                ></el-avatar>
                <span>{{ classInfo.classTeacherName }}</span>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row
                type="flex"
                align="middle"
                justify="end"
                style="height:40px"
              >
                <span> 人数:{{ classInfo.classSize }} </span>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="8" class="text-center">
            <el-button
              type="danger"
              icon="el-icon-user-solid"
              plain
              @click="addMemberHandler"
              >添加成员</el-button
            >
            <!-- 添加成员抽屉 -->
            <add-member
              :addMemberVisible="addMemberVisible"
              :classInfo="classInfo"
              :classList="classList"
              @reload="addSuccessReload"
              @close-add-member="addMemberVisible = false"
            />
          </el-col>
          <el-col :span="8" class="text-center">
            <el-button
              type="primary"
              icon="el-icon-setting"
              plain
              @click="settingClassHandler"
              >班级设置</el-button
            >

            <!-- 班级设置抽屉  -->
            <setting-class
              :settingClassVisible="settingClassVisible"
              :classInfo="classInfo"
              :classList="classList"
              @reload="addSuccessReload"
              @close-setting-class="settingClassVisible = false"
            />
          </el-col>
          <el-col :span="8" class="text-center">
            <el-button type="warning" icon="el-icon-coordinate" plain
              >待审核</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-tabs tab-position="left" @tab-click="clickTabHandler">
        <el-tab-pane label="学生管理">
          <el-row style="margin:10px 0">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名/姓名"
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
          </el-row>

          <!-- 学生管理提示 -->
          <el-row
            type="flex"
            justify="end"
            style="margin:10px 0;text-align:center"
            :gutter="10"
          >
            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="原班级不删除,复制到新班级"
                placement="top-start"
              >
                <el-tag type="info"
                  ><i class="el-icon-info">复制到新班级</i>
                </el-tag>
              </el-tooltip>
            </el-row>

            <el-row style="margin:0 10px">
              <el-tooltip
                class="item"
                effect="dark"
                content="原班级成员不删除,转移到新班级"
                placement="top-start"
              >
                <el-tag type="info">
                  <i class="el-icon-info">转移到新班级</i>
                </el-tag>
              </el-tooltip>
            </el-row>

            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="从原班级删除"
                placement="top-start"
              >
                <el-tag type="info">
                  <i class="el-icon-info">删除</i>
                </el-tag>
              </el-tooltip>
            </el-row>
          </el-row>

          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="memberList"
            border
            stripe
            fit
            highlight-current-row
            style="width: 100%"
            :default-sort="{ prop: 'fullName', order: 'ascending' }"
          >
            <el-table-column
              prop="fullName"
              align="left"
              label="学生"
              min-width="240"
              element-loading-text="请给我点时间！"
              sortable
            >
              <template slot-scope="{ row }">
                <el-row type="flex" align="middle">
                  <el-col :span="4">
                    <el-avatar
                      size="medium"
                      :src="baseURL + row.avatar_Middle"
                    ></el-avatar>
                  </el-col>

                  <el-col :span="12">
                    <span>{{
                      row.fullName
                        ? row.userName + "(" + row.fullName + ")"
                        : row.userName
                    }}</span>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column
              label="操作"
              align="center"
              min-width="320"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{}">
                <el-button type="primary" icon="el-icon-edit" plain size="mini">
                  修改昵称
                </el-button>

                <el-button type="primary" plain size="mini">
                  复制到新班级
                </el-button>

                <el-button type="success" plain size="mini">
                  转移到新班级
                </el-button>

                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 教师管理 -->
        <el-tab-pane label="教师管理">
          <el-row style="margin:10px 0">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名/姓名"
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
          </el-row>

          <!-- 教师管理提示 -->
          <el-row
            type="flex"
            justify="end"
            style="margin:10px 0;text-align:center"
            :gutter="10"
          >
            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="可复制到多个班级"
                placement="top-start"
              >
                <el-tag type="info"
                  ><i class="el-icon-info">复制到新班级</i>
                </el-tag>
              </el-tooltip>
            </el-row>

            <el-row style="margin:0 10px">
              <el-tooltip
                class="item"
                effect="dark"
                content="可转移到多个班级"
                placement="top-start"
              >
                <el-tag type="info">
                  <i class="el-icon-info">转移到新班级</i>
                </el-tag>
              </el-tooltip>
            </el-row>

            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="从原班级删除"
                placement="top-start"
              >
                <el-tag type="info">
                  <i class="el-icon-info">删除</i>
                </el-tag>
              </el-tooltip>
            </el-row>
          </el-row>

          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="memberList"
            stripe
            border
            highlight-current-row
            style="width: 100%"
            :default-sort="{ prop: 'fullName', order: 'ascending' }"
          >
            <el-table-column
              prop="fullName"
              align="left"
              label="教师"
              min-width="240"
              element-loading-text="请给我点时间！"
              sortable
            >
              <template slot-scope="{ row }">
                <el-row type="flex" align="middle">
                  <el-col :span="4">
                    <el-avatar
                      size="medium"
                      :src="baseURL + row.avatar_Middle"
                    ></el-avatar>
                  </el-col>

                  <el-col :span="12">
                    <span style="margin-left:10px">{{
                      row.fullName
                        ? row.userName + "(" + row.fullName + ")"
                        : row.userName
                    }}</span>
                  </el-col>

                  <el-col :span="8">
                    <el-tag
                      effect="dark"
                      v-if="row.userTypeName"
                      :type="row.userType | statusFilter"
                      >{{ row.userTypeName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column
              label="操作"
              align="center"
              min-width="320"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{}">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="可复制到多个班级"
                  placement="top"
                >
                  <el-button type="primary" plain size="mini">
                    复制到新班级
                  </el-button>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="可转移到多个班级"
                  placement="top"
                >
                  <el-button type="success" plain size="mini">
                    转移到新班级
                  </el-button>
                </el-tooltip>

                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<!-- <pagination
   v-show="total > 0"
   :total="total"
   :page.sync="listQuery.pageIndex"
   :limit.sync="listQuery.pageSize"
   :page-sizes="[8, 20, 30, 50]"
   @pagination="getList"
 /> -->
<script>
import Pagination from "@/components/Pagination";
import AddMember from "./AddMember";
import SettingClass from "./SettingClass";

import { getClassInfo, getMemberList } from "@/api/class";
import { mapGetters } from "vuex";

export default {
  components: {
    Pagination,
    AddMember,
    SettingClass
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
  props: ["classId", "classList"],
  data() {
    return {
      classInfo: [],
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
      settingClassVisible: false // 班级设置抽屉
    };
  },
  created() {
    this.getList();
  },
  watch: {
    searchKeyword(n, o) {
      if (n == "") {
        this.initListQuery();
        this.getList();
      }
    }
  },
  methods: {
    initListQuery() {
      this.listQuery.keyword = "";
    },
    async getList() {
      this.loading = true;
      // this.$emit("create"); // for test
      console.log("classId", this.classId);
      const info = await getClassInfo({ classId: this.classId });
      const memberList = await getMemberList(this.listQuery);
      if (info.success || memberList.success) {
        console.log("classInfo===获取班级信息", info.result);
        console.log("memberList===获取班级成员列表", memberList.result);
        this.classInfo = info.result;
        this.memberList = memberList.result.members;
        // this.memberList = this.sliceList(this.memberList, 8)[
        //   this.listQuery.pageIndex - 1
        // ];
        // this.total = this.memberList.length;
        this.loading = false;
      }

      if (info.error || memberList.error) {
        this.$message.error(info.error.message);
      }
    },
    clickTabHandler(tab, event) {
      console.log(tab, event);
      console.log(tab.label);
      if (tab.label == "学生管理") {
        this.studentManage();
      } else {
        this.teacherManage();
      }
    },
    teacherManage() {
      console.log("教师管理");
      this.listQuery.type = 1;
      this.getList();
    },
    studentManage() {
      console.log("学生管理");
      this.listQuery.type = 0;
      this.$nextTick(() => {
        this.getList();
      });
    },
    handleFilter() {
      this.listQuery.keyword = this.searchKeyword;
      this.getList();
    },
    // sliceList(array, subGroupLength) {
    //   let index = 0;
    //   let newArray = [];
    //   while (index < array.length) {
    //     newArray.push(array.slice(index, (index += subGroupLength)));
    //   }
    //   return newArray;
    // },
    addMemberHandler() {
      console.log("打开添加班级抽屉", this.classInfo);

      this.addMemberVisible = true;
    },
    settingClassHandler() {
      console.log("打开班级设置抽屉", this.classInfo);

      this.settingClassVisible = true;
    },
    addSuccessReload(id) {
      if (id) {
        this.$emit("reload", id);
      } else {
        this.$emit("reload");
      }
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped></style>
