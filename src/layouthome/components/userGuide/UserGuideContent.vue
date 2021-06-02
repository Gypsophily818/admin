<template>
  <div class="user-guide-bg">
    <section
      class="guide-info"
      v-for="(item, index) in userGuideObj"
      :key="index"
    >
      <div class="container">
        <div class="row">
          <div class="buy-info col-12 col-md-6">
            <h3 class="method-num">{{ item.Numtitle }}</h3>
            <!-- 两步 -->
            <template v-if="item.stepWays >= 2">
              <div class="guide-step1">
                <span class="method-title">{{ item.title[0] }}</span>
                <template v-if="item.desc.length > 1">
                  <p class="method-desc">
                    {{ item.desc[0] }}
                  </p>
                  <p class="method-desc">
                    {{ item.desc[1] }}
                  </p>
                  <h6 class="method-step">{{ item.steps[0] }}</h6>
                  <p class="method-step-detail">
                    {{ item.details[0] }}
                  </p>
                </template>
              </div>
              <template v-if="item.stepWays >= 2 && item.imgUrl.length === 2">
                <div class="guide-step2">
                  <span class="method-title">{{ item.title[1] }}</span>
                  <h6 class="method-step">{{ item.steps[1] }}</h6>
                  <p class="method-step-detail">
                    {{ item.details[1] }}
                  </p>
                </div>
              </template>
              <template v-if="item.stepWays >= 2 && item.imgUrl.length === 3">
                <div class="guide-step2" style="margin-top: 50%">
                  <span class="method-title">{{ item.title[1] }}</span>
                  <h6 class="method-step">{{ item.steps[1] }}</h6>
                  <p class="method-step-detail">
                    {{ item.details[1] }}
                  </p>
                </div>
              </template>
            </template>

            <!-- 只有一步 -->
            <template v-else>
              <span class="method-title">{{ item.title }}</span>
              <p class="method-desc">
                {{ item.desc }}
              </p>
              <h6 class="method-step">{{ item.steps }}</h6>
              <p class="method-step-detail">
                {{ item.details }}
              </p>
            </template>
          </div>
          <div class="buy-info-sketch col-12 col-md-6">
            <template v-if="item.stepWays >= 2 && item.imgUrl.length === 2">
              <el-image :src="item.imgUrl[0]"></el-image>
              <el-image
                :src="item.imgUrl[1]"
                style="margin-top: 100px"
              ></el-image>
            </template>
            <template v-if="item.stepWays >= 2 && item.imgUrl.length === 3">
              <el-image :src="item.imgUrl[0]"></el-image>
              <el-image
                :src="item.imgUrl[1]"
                style="margin-top: 100px"
              ></el-image>
              <el-image
                :src="item.imgUrl[2]"
                style="margin-top: 100px"
              ></el-image>
            </template>
            <template v-if="typeof item.imgUrl === 'string'">
              <el-image :src="item.imgUrl"></el-image>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ["userGuideObj"],
  data() {
    return {};
  },
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
.guide-info {
  padding: 100px 0;
  .buy-info {
    text-align: left;
    [class^="method-"] {
      font-family: Microsoft YaHei;
    }
    .method-num {
      font-size: 2.5rem;
      font-weight: 600;
      color: #3c83f3;
    }

    .method-title {
      padding: 10px 0 30px 0;
      display: block;
      font-size: 1.25rem;
      font-weight: 600;
      color: #000;
    }
    .method-desc {
      font-size: 1rem;
      font-weight: 400;
      color: #666;
      margin-bottom: 10px;
    }
    [class^="method-step"] {
      color: #666;
      line-height: 2;
      font-weight: 300;
      font-size: 0.875rem;
    }
    .method-step {
    }
    .method-step-detail {
      font-size: 0.875rem;
    }
  }
  .guide-step1 {
    padding: 0 0 100px 0;
  }
  .guide-step2 {
    margin-top: 60px;
  }
  .buy-info-sketch {
    .el-image {
      box-shadow: 0px 0px 30px 6px rgba(165, 165, 165, 0.3);
    }
  }
  &:nth-of-type(even) {
    background-color: #f4f4f4;
  }
  &:nth-of-type(odd) {
    background-color: #fff;
  }
}
</style>
