<template>
  <div class="service-object">
    <div class="feature-img">
      <el-image :src="introduceTitleImg"></el-image>
    </div>
    <div id="service-info" class="service-info container">
      <el-row>
        <el-col
          v-for="item in serviceObj"
          :key="item.id"
          class="col-12 col-md-4"
        >
          <el-card :body-style="{ padding: '0px' }" class="service-card">
            <img :src="item.imgs" class="image" />
            <div style="padding: 20px">
              <span class="serviceInfo-title">{{ item.text }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 产品介绍图标
      introduceTitleImg: require("@/assets/home/serviceObject/serviceObj_title.png"),
      serviceObj: [
        {
          id: 1,
          imgs: require("@/assets/home/serviceObject/serviceObj_middleSchool.png"),
          text: "初中",
        },
        {
          id: 2,
          imgs: require("@/assets/home/serviceObject/serviceObj_collage.png"),
          text: "大学",
        },
        {
          id: 3,
          imgs: require("@/assets/home/serviceObject/serviceObj_institution.png"),
          text: "机构",
        },
      ],
    };
  },
};
</script>
<style
  src="../../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style>;

<style
  src="../../../../node_modules/bootstrap/dist/css/bootstrap.css"
  scoped
></style>;
<style lang="scss" scoped>
.service-object {
  text-align: center;
  margin-top: 50px;
  padding: 90px 0;
  background: url("../../../assets/home/serviceObject/serviceObj_bg.png");
  height: 660px;
  background-size: cover;
  .feature-img {
    margin-bottom: 80px;
  }
}
</style>
