<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <!-- <div slot="header" class="box-card-header">
      <img
        src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png"
      />
    </div> -->
    <el-row type="flex" justify="center">
      <mallki text="作业情况" />
    </el-row>
    <div v-if="jobSituationData">
      <!-- <pan-thumb :image="avatar" class="panThumb" /> -->
      <!-- <el-row style="position:relative;">
        <mallki class-name="mallki-text" text="作业情况" />
      </el-row> -->

      <div style="padding-top:35px;" class="progress-item">
        <el-row type="flex">
          <span>作业平均时长：</span>
          <span>{{ jobSituationData.avgTotalDuration }}</span>
        </el-row>

        <!-- <el-progress :percentage="100" status="success" /> -->
      </div>
      <div class="progress-item">
        <el-row type="flex">
          <span>试卷平均时长：</span>
          <span>{{ jobSituationData.avgDurationOfTestPaper }}</span>
        </el-row>

        <!-- <el-progress :percentage="18" /> -->
      </div>
      <div class="progress-item">
        <el-row type="flex">
          <span>题目平均时长：</span>
          <span>{{ jobSituationData.avgDurationOfQuestion }}</span>
        </el-row>
      </div>
      <div class="progress-item">
        <el-row type="flex">
          <span>平均回合数：</span>
          <span>{{ jobSituationData.avgRound }}</span>
        </el-row>
      </div>

      <div class="progress-item">
        <span>平均答错率：</span>
        <el-progress :percentage="jobSituationData.avgErrorRate | parse" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import PanThumb from "@/components/PanThumb";
import Mallki from "@/components/TextHoverEffect/Mallki";
// import { parseRate } from "@/utils/common"; // 引入公共方法

export default {
  props: ["jobSituationData"],
  components: { PanThumb, Mallki },
  filters: {
    parse(val) {
      val = (val * 100).toPrecision(4);
      let old = val.toString();
      let newstr = old;
      //循环变量 小数部分长度
      var leng = old.length - old.indexOf(".") - 1;
      //判断是否有效数
      if (old.indexOf(".") > -1) {
        //循环小数部分
        for (let i = leng; i > 0; i--) {
          //如果newstr末尾有0
          if (
            newstr.lastIndexOf("0") > -1 &&
            newstr.substr(newstr.length - 1, 1) == 0
          ) {
            var k = newstr.lastIndexOf("0");
            //如果小数点后只有一个0 去掉小数点
            if (newstr.charAt(k - 1) == ".") {
              return newstr.substring(0, k - 1) * 1;
            } else {
              //否则 去掉一个0
              newstr = newstr.substring(0, k);
            }
          } else {
            //如果末尾没有0
            return newstr * 1;
          }
        }
      }
    },
    data() {
      return {
        statisticsData: {
          article_count: 1024,
          pageviews_count: 1024
        }
      };
    },
    computed: {
      ...mapGetters(["name", "avatar", "roles"])
    }
  }
};
</script>

<style lang="scss">
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    // right: 0px;
    right: 50%;
    transform: translateX(50%);
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px !important;
    width: 70px !important;
    position: absolute !important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none !important;
    ::v-deep .pan-info {
      box-shadow: none !important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
