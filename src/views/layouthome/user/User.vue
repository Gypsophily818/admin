<template>
  <el-container class="user-page">
    <el-main>
      <el-button size="medium" @click="$router.push('/')">首页</el-button>
      <UserInfo />
      <div @click="getHomework" class="get-homework">getHomework</div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
// import Header from "@/layout/components/Header";
import UserInfo from "@/layout/components/user/UserInfo";
export default {
  components: {
    // Header,
    UserInfo,
  },
  methods: {
    getHomework() {
      this.axios({
        // url: "/api/Product/BookList",
        // url: "/api/student/Record/JobPlanList",
        // method: "GET",
        // url: "/api/Business/Team/Index",
        // url: "/api/Feedback/Index",
        url: "/api/student/Lecture/QuizResult",

        method: "GET",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    // ...
    to.meta.show = true;
    next();
  },
};
</script>

<style lang="scss">
.get-homework {
  width: 300px;
  height: 400px;
  border: 1px solid red;
  cursor: pointer;
}
</style>
