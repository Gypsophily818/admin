<template>
  <!-- 错题成员列表-->
  <div class="error-member">
    <h3>错题成员({{ details.studentList.length }})</h3>
    <div class="error-member-container">
      <template v-for="(item, index) in details.studentList">
        <el-card class="box-card error-card" :key="index">
          <div class="block error-card-header">
            <el-avatar
              :size="40"
              class="student-avatar"
              :src="baseURL + item.avatar_Middle"
            ></el-avatar>
            <span class="student-name">
              {{
                item.fullName
                  ? item.fullName + "" + "(" + item.userName + ")"
                  : item.userName
              }}
            </span>
          </div>
          <div class="error-card-answer">
            <p>学生答案:</p>
            <div class="answer-list">
              <div
                class="answer-item"
                v-for="(answer, index) in item.userAnswer.answerContents"
                :key="index"
              >
                <span :class="answer.isRight ? 'textblack' : 'textred'">
                  {{ answer.answerContent | decodeURI }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    showCode: {
      type: Number,
      default: 1
    },
    details: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters(["baseURL"]),
    paperContentModels() {
      return this.details.contentModels;
    }
  },
  filters: {
    decodeURI(val) {
      return decodeURIComponent(val);
    }
  },created(){
    console.log('错题成员==',this.details.studentList);
  }
};
</script>

<style lang="scss" scoped>
.error-member {
  .error-card {
    margin-bottom: 10px;
    .el-card__body {
      padding: 10px;
      .error-card-header {
        display: flex;
        align-items: center;
        .student-avatar {
          margin-right: 5px;
        }
      }
      .error-card-answer {
        .answer-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
