<template>
  <el-main class="feature-wrapper">
    <el-row>
      <el-image :src="featureTitle"></el-image>
    </el-row>
    <el-row>
      <el-col v-for="(item, index) in features" :key="index" :xs="24" :sm="8">
        <el-card
          class="item-box"
          :body-style="{ padding: '0px' }"
          shadow="never"
        >
          <el-image :src="item.imgUrl"></el-image>
          <div class="bottom clearfix">
            <h4 class="feature-title">{{ item.title }}</h4>
            <div style="padding: 14px">
              <p
                class="featrue-text"
                v-for="(items, indexs) in item.practicability_text"
                :key="indexs"
              >
                {{ items }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  props: ["features"],
  data() {
    return {
      // 产品特点图标
      featureTitle: require("@/assets/home/feature/feature_title.png")
    };
  }
};
</script>

<style lang="scss" scoped>
.feature-wrapper {
  padding-bottom: 78px;
  text-align: center;
  .el-row {
    padding-top: 110px;
    .item-box {
      border: none;
    }
    .featrue-text {
      font-size: 16px;
      color: #666;
    }
    .feature-title {
      font-weight: bold;
      font-size: 20px;
      color: #333;
    }
  }
}
</style>
