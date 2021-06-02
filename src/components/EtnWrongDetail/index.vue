<template>
  <div>
    <!-- 错题标识 -->
    <wrong-type :details="details" />
    <!-- 错题展示 -->
    <wrong-question :question="details.question" />
    <!-- 错题成员 -->
    <wrong-member :details="details" />
  </div>
</template>

<script>
import WrongType from "./components/WrongType.vue";
import WrongMember from "./components/WrongMember.vue";
import WrongQuestion from "./components/WrongQuestion.vue";
export default {
  props: {
    showCode: {
      type: Number,
      default: 1
    },
    details: {
      type: Object,
      default: () => ({})
    }
  },
  components: { WrongType, WrongQuestion, WrongMember }
};
</script>

<style></style>
