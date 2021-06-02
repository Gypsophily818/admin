<!--搜索与重置-->
<template>
  <span>
    <!-- @click="crud.toQuery" -->
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      >搜索</el-button
    >
    <!-- v-if="crud.optShow.reset" -->
    <el-button
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-refresh-left"
      >重置</el-button
    >
    <!-- @click="crud.resetQuery()" -->
  </span>
</template>
<script>
// import { crud } from './crud'
export default {
  // mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
