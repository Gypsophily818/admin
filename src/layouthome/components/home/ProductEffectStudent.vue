<template>
  <div class="institution-info">
    <el-row>
      <el-col :xs="24" :sm="14" :md="14">
        <div class="institions">
          <el-row>
            <p class="institution-title">学生端：<span>成绩提升系统</span></p>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textL">
                <el-col :xs="24">
                  <ul>
                    <li>
                      <span class="text-item">学生对自己个人信息管理</span>
                    </li>
                    <li><span class="text-item">查看班级列表</span></li>
                  </ul>
                </el-col>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textR">
                <ul>
                  <li>
                    <span class="text-item"
                      >学生查看作业记录、查看错题记录</span
                    >
                  </li>
                  <li>
                    <span class="text-item"
                      >要求学生限时完成作业、限时批改纠错</span
                    >
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10" :md="8" class="instution-bg-wrapper">
        <el-image class="instution-bg" :src="effectInstitutionImg"></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      effectInstitutionImg: require("@/assets/home/effect/effect_student.png"),
    };
  },
};
</script>
<style lang="scss" scoped>
.institution-title {
  text-align: left;
}
</style>
