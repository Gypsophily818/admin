<template>
  <div class="user-info">
    <!-- <el-image :src=''></el-image> -->
    <!-- <el-avatar :size="size" :src="circleUrl"></el-avatar> -->
    <el-card class="box-card" v-show="$route.meta.show">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button
        > -->
      </div>
      <div>用户名:{{ userInfo.userName }}</div>

      <div>真实姓名:{{ userInfo.actualName }}</div>
      <div v-if="avatarUrl">
        头像:
        <el-avatar
          :size="50"
          :src="avatarUrl + userInfo.avatar_Middle"
        ></el-avatar>
      </div>
      <div>用户类型:{{ userInfo.userTypeName }}</div>
      <el-row class="reset-pw">
        <i class="el-icon-key" @click="resetPassword">&nbsp;&nbsp;修改密码</i>
        <!-- v-model="isResetPage" -->
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getuserInfo } from "@/util/common.js";
import * as API from "@/api";
export default {
  created() {
    console.log(this.userInfo);
    this.userInfo = getuserInfo();
    // console.log(this.$route);
  },
  data() {
    return {
      userInfo: {},
      avatarUrl: API.baseURL,
      isResetPage: false,
    };
  },
  mounted() {},
  methods: {
    resetPassword() {
      console.log(999);
      // this.isResetPage
      // ? this.$router.push("/user")
      // :
      this.$router.push("/user/resetPassword");
      // this.isResetPage = !this.isResetPage;
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   // ...
  //   console.log(to.meta.show);
  //   to.meta.show = true;
  //   next();
  // },
};
</script>

<style lang="scss">
.box-card {
  text-align: left;
  .reset-pw {
    cursor: pointer;
  }
}
</style>
