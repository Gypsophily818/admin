<template>
  <el-date-picker
    v-model="value1"
    type="datetimerange"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['12:00:00']"
  >
  </el-date-picker>
</template>

<script>
export default {
  data() {
    return {
      value1: ""
    };
  }
};
</script>
