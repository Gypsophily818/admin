<template>
  <div class="about">
    <section class="about-header">
      <div class="company-info container">
        <el-image :src="about_bg" class="company-bg"></el-image>
        <div class="company-text col-12 col-md-12 col-lg-6">
          英乐腾教育创建于2011年，专注于留学教育及英语教学服务，
          提供教学内容订制化的教育平台，力于用先进的教育科技、优
          质的教育内容和持续的教育热情，为留学考试、K12阶段的学
          校、家庭、社会教育场景，提供更为高效、美好的产品和体验，
          开启智能教育新时代。
        </div>
      </div>
    </section>
    <section class="company-founder-wrapper">
      <div class="container">
        <el-image :src="founderTitle" class="founder-title"></el-image>
        <div class="company-founder row">
          <div class="founder col-12 col-md-12 col-lg-6">
            <el-image :src="founder"></el-image>
          </div>
          <el-card class="box-card col-12 col-md-12 col-lg-6">
            <p class="name">陈天启<span class="rank">(教授)</span></p>
            <p class="personal-info">
              复旦大学硕士，解构英语学习法创始人，英乐腾教育的创始人，被称为快速提升英语实力魔术师。
            </p>
            <p class="personal-comapny">
              英乐腾教育由解构英语学习法创始人陈启天教授于2011年创立，致力于为出国人群提供全方位的留学及英语教学服务，是国内为数不多拥有自主知识产权教学教研核心技术的英语教育机构。
            </p>
          </el-card>
        </div>
      </div>
    </section>
    <section class="partner-wrapper container">
      <el-image
        :src="partnerTitle"
        class="company-partner"
        style="margin: 100px"
      ></el-image>
      <div class="partner-info row">
        <el-card
          :body-style="{ padding: '0px' }"
          v-for="(item, index) in partnerImg"
          :key="index"
          class="col-6 col-md-3"
        >
          <img :src="item.img" class="image" />
          <div style="padding: 14px">
            <span>{{ item.P_name }}</span>
          </div>
        </el-card>
      </div>
    </section>

    <section class="about-more" id="about-more">
      <swiper
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        :options="swiperOption"
      >
        <swiper-slide v-for="(item, index) in moreImg" :key="index">
          <el-image :src="item" class="company-partner"></el-image>
        </swiper-slide>
      </swiper>
    </section>
  </div>
</template>

<script>
// import Vue from "vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import style (<= Swiper 5.x)
import "swiper/css/swiper.css";

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      about_bg: require("@/assets/about/profile.png"),
      founderTitle: require("@/assets/about/founder_title.png"),
      founder: require("@/assets/about/founder.png"),
      partnerTitle: require("@/assets/about/partner.png"),
      partnerImg: [
        {
          img: require("@/assets/about/partner_logo1.png"),
          P_name: "广东外贸外语大学英语教育学院"
        },
        {
          img: require("@/assets/about/partner_logo2.png"),
          P_name: "华南师范大学外语学院"
        },
        {
          img: require("@/assets/about/partner_logo3.png"),
          P_name: "广州大学外语学院"
        },
        {
          img: require("@/assets/about/partner_logo4.png"),
          P_name: "广东中医药大学外语学院"
        }
      ],
      moreImg: [
        require("@/assets/about/more_1.jpg"),
        require("@/assets/about/more_2.jpg"),
        require("@/assets/about/more_3.jpg"),
        require("@/assets/about/more_4.jpg"),
        require("@/assets/about/more_5.jpg"),
        require("@/assets/about/more_6.jpg"),
        require("@/assets/about/more_7.jpg")
      ],
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 2000,
          //当用户滑动图片后继续自动轮播
          disableOnInteraction: false
        }
      }
    };
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log("slide change");
    }
  }
};
</script>
<style
  src="../../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style>;

<style
  src="../../../../node_modules/bootstrap/dist/css/bootstrap.css"
  scoped></style>;
<style lang="scss">
.about {
  .about-header {
    background: url("../../../assets/about/about_bg.png") no-repeat;
    height: 660px;
    width: 100%;
    display: flex;
    align-items: flex-start;

    .company-bg {
      padding: 110px 0 80px 0;
    }
    .company-info {
      text-align: left;
      .company-text {
        padding: 0;
        font-size: 1.25rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
        line-height: 48px;
      }
    }
  }
  .company-founder-wrapper {
    background-color: #f4f4f4;
    padding-bottom: 100px;
    .founder-title {
      margin: 100px;
    }
    .company-founder {
      .founder {
        max-height: 480px;
        padding: 0;
      }
      .box-card {
        text-align: left;
        border: none;
        box-shadow: none;
        padding: 0;
        background-color: #f4f4f4;
        .el-card__body {
          padding-top: 0;
          .name {
            height: 35px;
            font-size: 2.25rem;
            color: #333;
            .rank {
              font-size: 1.5rem;
            }
            padding-bottom: 60px;
          }
          .personal-info {
            font-size: 1.25rem;
            color: #666;
            line-height: 36px;
          }
          .personal-comapny {
            // height: 108px;
            font-size: 1.25rem;
            font-weight: 300;
            color: #666666;
            line-height: 48px;
          }
        }
      }
    }
  }
  .partner-wrapper {
    .partner-info {
      .el-card {
        border: none;
        box-shadow: none;
        padding-bottom: 20px;
        .el-card__body {
          img {
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  #about-more {
    text-align: center;
    .swiper-container {
      .swiper-wrapper {
        .swiper-slide {
          .el-image {
            margin: 0;
            padding: 40px 0 30px 0;
          }
        }
      }
    }
  }
}
</style>
