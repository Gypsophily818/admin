<template>
  <div class="institution-info">
    <el-row>
      <el-col :xs="24" :sm="10" :md="8" class="instution-bg-wrapper">
        <el-image class="instution-bg" :src="effectInstitutionImg"></el-image>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14">
        <div class="institions">
          <el-row>
            <p class="institution-title">教师端：<span>智能化批改系统</span></p>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textL">
                <el-col :xs="24">
                  <ul>
                    <li>
                      <span class="text-item">支持教师对班级设置学生管理</span>
                    </li>
                    <li><span class="text-item">设置个人信息管理</span></li>
                    <li>
                      <span class="text-item"
                        >支持教师对学生布置作业设置要求</span
                      >
                    </li>
                  </ul>
                </el-col>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textR">
                <ul>
                  <li>
                    <span class="text-item">全题型AI自动评改</span>
                  </li>
                  <li><span class="text-item">教师查看作业布置记录</span></li>
                  <li>
                    <span class="text-item"
                      >查看报告数据分析、查看题库了解详情</span
                    >
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 产品功能图标
      effectInstitutionImg: require("@/assets/home/effect/effect_teacher.png"),
    };
  },
};
</script>
<style lang="scss" scoped>
.institution-info {
  .institution-title {
    text-align: right;
  }
}
</style>
