<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人信息" name="personalInfo">
                <personal-info :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import PersonalInfo from "./components/PersonalInfo";
import Timeline from "./components/Timeline";
import Account from "./components/Account";
import { getInfo } from "@/api/user";

export default {
  name: "Profile",
  components: { UserCard, PersonalInfo, Timeline, Account },
  data() {
    return {
      user: this.loginedUser,
      activeTab: "personalInfo"
    };
  },
  computed: {
    ...mapGetters(["loginedUser"])
  },
  created() {
    this.getUserInfo();
    console.log("loginedUser", this.loginedUser);
    console.log(this.user);
  },
  methods: {
    async getUserInfo() {
      const res = await getInfo();
      console.log(res);
      this.user = this.loginedUser || res.result;
    }
  }
};
</script>
