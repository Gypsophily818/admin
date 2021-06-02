<template>
  <div>
    <!-- paperCode 0=学生做题试卷展示  1=题库试卷展示-->
    <!-- 学生做题试卷展示-->
    <!-- <template v-if="paperCode === 0">
      <StudentPaper :details="details" />
    </template> -->

    <!-- 题库试卷展示 paperCode === 1 -->
    <!-- <template v-if="paperCode === 1">
      <Paper :details="details" />
    </template> -->
      <Paper :details="details" />
  </div>
</template>

<script>
import StudentPaper from "./components/StudentPaper";
import Paper from "./components/Paper";

export default {
  components: {
    StudentPaper,
    Paper
  },
  props: {
    paperCode: [Number],
    isOnlyWrong: {
      type: Boolean,
      default: false
    },
    details: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style lang="scss" scoped></style>
