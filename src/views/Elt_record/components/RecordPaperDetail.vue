<template>
  <div>
    <el-dialog :visible.sync="paperDetailVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$emit('closePaperDetai', false)"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["paperDetailVisible"],
  data() {
    return {
      pvData: [1, 2, 3]
    };
  }
};
</script>

<style></style>
