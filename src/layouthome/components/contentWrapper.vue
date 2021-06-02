<template>
  <div class="content-wrapper">
    <transition name="el-fade-in-linear">
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>

export default {
  name: "content-wrapper",
  computed: {
    key() {
      return this.$route.path;
    }
  },
  data() {
    return {};
  }
};
</script>

