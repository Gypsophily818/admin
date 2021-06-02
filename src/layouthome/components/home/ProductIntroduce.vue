<template>
  <el-main class="production">
    <div class="feature-img">
      <el-image :src="introduceTitleImg"></el-image>
    </div>
    <div class="production-info">
      <el-image :src="introduceInfoImg"></el-image>
    </div>
  </el-main>
</template>

<script>
export default {
  props: ["features"],
  data() {
    return {
      // 产品介绍图标
      introduceTitleImg: require("@/assets/home/introduce/introduce_title.png"),
      introduceInfoImg: require("@/assets/home/introduce/introduce_info.png")
    };
  }
};
</script>

<style lang="scss" scoped>
.production {
  text-align: center;
  padding: 90px 0;
  background: #f4f4f4;
  .feature-img {
    margin-bottom: 80px;
  }
}
</style>
