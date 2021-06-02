<template>
  <div class="institution-info">
    <el-row>
      <el-col :xs="24" :sm="14" :md="14">
        <div class="institions">
          <el-row>
            <p class="institution-title">机构端：<span>数据化管理系统</span></p>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textL">
                <el-col :xs="24">
                  <ul>
                    <li><span class="text-item">设置专属自己的品牌</span></li>
                    <li><span class="text-item">自定义定制轮播界面</span></li>
                    <li><span class="text-item">支持对教师端管理</span></li>
                    <li><span class="text-item">购买名额管理</span></li>
                  </ul>
                </el-col>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12">
              <div class="instution-textR">
                <ul>
                  <li>
                    <span class="text-item">可以批量设置教师、学生用户</span>
                  </li>
                  <li><span class="text-item">可以定制、导入题库</span></li>
                  <li><span class="text-item">设置教学科目等设置</span></li>
                  <li>
                    <span class="text-item"
                      >可以观察学生成长、分析成绩排名分析</span
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
      // 产品功能图标
      effectTitleImg: require("@/assets/home/effect/effect_title.png"),
      effectInstitutionImg: require("@/assets/home/effect/effect_institution.png"),
    };
  },
};
</script>

<style lang="scss"></style>
