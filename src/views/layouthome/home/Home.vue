<template>
  <div class="homePage">
    <div class="banner-wrapper">
      <el-image :src="bannerImgs"></el-image>
    </div>
    <!-- 产品特色 -->
    <ProductFeature :features="features" />
    <!-- 产品介绍 -->
    <ProductIntroduce />
    <!-- 产品功能 -->
    <ProductEffect />
    <!-- 服务对象 -->
    <ServiceObject />
    <!-- 我们的服务 -->
    <OurService />
  </div>
</template>

<script>
import ProductFeature from "@/layouthome/components/home/ProductFeature.vue";
import ProductIntroduce from "@/layouthome/components/home/ProductIntroduce.vue";
import ProductEffect from "@/layouthome/components/home/ProductEffect.vue";
import ServiceObject from "@/layouthome/components/home/ServiceObject.vue";
import OurService from "@/layouthome/components/home/OurService.vue";
export default {
  components: {
    ProductFeature,
    ProductIntroduce,
    ProductEffect,
    ServiceObject,
    OurService
  },
  metaInfo: {
    title: "首页-Enliten", // set a title
    meta: [
      {
        name: "keyWords",
        content: "Enliten,english,英乐腾,绅士岛,英语,机构,留学,教学,教育"
      },
      {
        name: "description",
        content:
          "英乐腾教育创建于2011年，专注于留学教育及英语教学服务， 提供教学内容订制化的教育平台，力于用先进的教育科技、优 质的教育内容和持续的教育热情，为留学考试、K12阶段的学 校、家庭、社会教育场景，提供更为高效、美好的产品和体验， 开启智能教育新时代。"
      }
    ]
  },
  data() {
    return {
      // 导航图
      bannerImgs: require("@/assets/home/banner/banner1.png"),
      features: [
        {
          imgUrl: require("@/assets/home/feature/feature_practicability.png"),
          title: "实用性",
          practicability_text: [
            "专业的运营",
            "详实的内容",
            "数据化的教学过程",
            "降维竞争的个性化平台"
          ]
        },
        {
          imgUrl: require("@/assets/home/feature/feature_profession.png"),
          title: "专业性",
          practicability_text: [
            "15年软件研发与应用",
            "30年企业运营管理经验",
            "40年深耕英语教学积累",
            "原创教材/课程/练习内容"
          ]
        },
        {
          imgUrl: require("@/assets/home/feature/feature_safety.png"),
          title: "安全性",
          practicability_text: [
            "软件不收集用户信息",
            "知识产权由国家认证",
            "杜绝广告/引流等营销",
            "增强机构发展稳定性 "
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.homePage {
  background: #fff;

  .banner-wrapper {
    .el-image {
      display: block;
    }
  }
  #service-info {
    .el-row {
      .el-col {
        .el-card {
          border: none;
          background: none;
          box-shadow: none;
          .image {
            width: 100%;
          }
          .serviceInfo-title {
            font-weight: bold;
            font-size: 24px;
            color: #333;
          }
          .serviceInfo-text {
            text-align: left;
            line-height: 36px;
            color: #666;
            padding: 0 0px;
          }
        }
      }
    }
  }
}
</style>
