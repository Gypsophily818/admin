<template>
  <div class="production">
    <div class="feature-img">
      <el-image :src="introduceTitleImg"></el-image>
    </div>
    <div id="service-info" class="service-info container">
      <el-row>
        <el-col
          v-for="item in ourService"
          :key="item.id"
          class="col-12 col-md-4"
        >
          <el-card :body-style="{ padding: '0px' }" class="service-card">
            <img :src="item.imgs" class="image" />
            <div class="text-wrapper">
              <div style="padding: 20px">
                <span class="serviceInfo-title">{{ item.title }}</span>
                <div class="serviceInfo-text">
                  {{ item.text }}
                </div>
              </div>
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
      introduceTitleImg: require("@/assets/home/ourService/ourService_title.png"),
      ourService: [
        {
          id: 1,
          imgs: require("@/assets/home/ourService/ourService_img1.png"),
          title: "软件教学",
          text:
            "多版本同步练习题库、多维度专项训练题库、专 家讲解系、列视频课程、漫画版词汇原创教、各 类考试仿真模拟题库。",
        },
        {
          id: 2,
          imgs: require("@/assets/home/ourService/ourService_img2.png"),
          title: "教师服务",
          text:
            "教师能力培训、英语教学培训、提分技巧培训、能力拓展培训、学生管理培训。",
        },
        {
          id: 3,
          imgs: require("@/assets/home/ourService/ourService_img3.png"),
          title: "运营支持",
          text:
            "运行现状诊断、营销策略指导、人员招聘培训、效益提升指导、管理能力培训。",
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
.production {
  padding: 90px 0;
  background: #f4f4f4;
  text-align: center;
  .feature-img {
    margin-bottom: 80px;
  }
  #service-info {
    .el-row {
      .el-col {
        .service-card {
          box-shadow: 0px 0px 30px 6px rgba(165, 165, 165, 0.3);
          .el-card__body {
            .text-wrapper {
              background: #fff;
              min-height: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
