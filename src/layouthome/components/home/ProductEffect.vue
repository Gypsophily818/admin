<template>
  <div class="product-effect container">
    <div class="feature-img">
      <el-image :src="effectTitleImg"></el-image>
    </div>
    <el-container>
      <!-- 机构端 -->
      <ProductEffectInstitution />
      <!-- 教师端 -->
      <ProductEffectTeacher />
      <!-- 学生端 -->
      <ProductEffectStudent />
    </el-container>
  </div>
</template>

<script>
import ProductEffectInstitution from "./ProductEffectInstitution";
import ProductEffectTeacher from "./ProductEffectTeacher";
import ProductEffectStudent from "./ProductEffectStudent";
export default {
  components: {
    ProductEffectInstitution,
    ProductEffectTeacher,
    ProductEffectStudent
  },
  data() {
    return {
      // 产品功能图标
      effectTitleImg: require("@/assets/home/effect/effect_title.png"),
      effectInstitutionImg: require("@/assets/home/effect/effect_institution.png")
    };
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
.product-effect {
  background: #fff;
  text-align: center;
  .feature-img {
    padding: 90px 0 0 0;
  }
  .institution-title {
    text-align: left;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    min-width: 236px;
    span {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .institution-info {
    margin-top: 150px;
    .institions {
      [class^="instution-text"] {
        text-align: left;
        z-index: 1;

        li {
          list-style: none;
          height: 48px;
          .text-item {
            padding-left: 30px;
            position: relative;
            text-align: left;
            color: #666;
            font-size: 16px;
            &::before {
              content: "";
              display: block;
              width: 20px;
              height: 18px;
              position: absolute;
              top: 0px;
              background: url("../../../assets/home/effect/effect_listImg.png")
                no-repeat;
            }
          }
        }
      }
    }
    .instution-textR {
      padding-top: 30px;
    }
    .instution-textL {
      padding-top: 10px;
    }
    .instution-bg-wrapper {
      margin-top: 30px;
      .instution-bg {
      }
    }
  }
}
</style>
