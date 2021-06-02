<template>
  <!-- 题目类型标识-->
  <div>
    <div class="tag-wrapper">
      <el-tag class="answer-type-tag">
        {{ details.question.answerTypeName }}
      </el-tag>
      <el-tag type="danger">
        {{ details.question.questionType }}
      </el-tag>
    </div>
    <div class="error-rate">
      <span class="error-expain">有{{ details.errorRate }}人做错了这道题</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    details: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(["baseURL"])
  }
};
</script>

<style lang="scss" scoped>
.tag-wrapper {
  margin-top: -30px;
  .answer-type-tag {
    margin-right: 8px;
  }
}
.error-rate {
  padding: 10px;
  padding-left: 0;
  .error-expain {
    font-size: 16px;
  }
}
</style>
