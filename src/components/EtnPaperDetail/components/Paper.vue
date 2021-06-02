<template>
  <div v-if="details">
    <!-- 头部 -->
    <el-row type="flex" justify="center">
      <el-row type="flex" justify="center">
        <div class="paper-require-name">
          <b>{{ details.testPaperName }}</b>
        </div>
      </el-row>

      <div class="paper-require-type">
        <svg-icon icon-class="start" />{{ details.testPaperRequireTypeName }}
      </div>
      <div class="paper-total-number">
        总题数:&nbsp;{{ details.totalNumberOfQuestions }}&nbsp;题
      </div>
    </el-row>

    <br />

    <el-card class="box-card" shadow="never">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-row type="flex" justify="center">
            <span class="exam-desc">要求完成时长：</span>
            <span class="exam-desc-text">
              {{ details.requireFinishedDuration }}
            </span>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" justify="center">
            <span class="exam-desc">要求正确率：</span>
            <span class="exam-desc-text">
              {{ details.requirePassableRate }}
            </span>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex" justify="center">
            <span class="exam-desc">包含题型：</span>
            <span class="exam-paper-inculdeTexts">
              <span
                class="exam-desc-text"
                v-for="(word, index) in details.includeQuestionType"
                :key="index"
              >
                {{ word }}
                {{
                  index === details.includeQuestionType.length - 1 ? "" : ","
                }}&nbsp;
              </span>
            </span>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <br />

    <!-- 题干内容 -->
    <div
      class="exam-paper-contentWrapper"
      v-for="(item, indexs) in contentModels"
      :key="indexs"
      style="font-weight: normal;"
    >
      <!-- 大题目 questionGroupModels -->
      <div class="item-title" style="background-color:lightgreen">
        <span>{{ item.serialNumberSymbol }}.</span>
        <span
          v-for="(title, index) in item.questionGroupModels"
          :key="'item-title' + index"
        >
          <!-- // 为0 文本直接呈现 不需要解析 -->
          <template v-if="title.contentType === 0">
            <span>
              {{ title.contentValue }}
            </span>
          </template>
          <template v-else>
            <div v-html="title.contentValue"></div>
          </template>
        </span>
      </div>

      <!-- 大题目内试题列表 questionModels -->
      <div
        class="exam-questionModels"
        v-for="(questions, index) in item.questionModels"
        :key="'exam-questionModels' + index"
        style="background:lightblue"
      >
        <!-- 试题题目 group (questionModels.group.content) -->
        <template v-if="questions">
          <span
            class="exam-group"
            v-for="(group, groupIndex) in questions.group.content"
            :key="'exam-group' + groupIndex"
          >
            <template>
              <div>
                <!-- {{ group.contentValue | decodeURI }} -->
                <!-- {{ group.contentValue }} -->
              </div>
            </template>

            <el-row type="flex" align="middle">
              <template v-if="questions.numberSymbol">
                <span>{{ questions.numberSymbol }}</span>
              </template>
              <!-- 文本 -->
              <template v-if="[0].includes(group.contentType)">
                <!-- 题目 -->
                <!-- <span>{{ group.contentValue }}</span> -->
              </template>

              <!-- 图片 -->
              <template v-if="[1].includes(group.contentType)">
                <el-image :src="baseURL + group.contentValue"></el-image>
              </template>

              <!-- 富文本 markdown 发音文本 -->
              <template v-if="[4, 5, 6].includes(group.contentType)">
                <div v-html="group.contentValue" />
              </template>
            </el-row>
          </span>
        </template>

        <!-- 题目内容 content (questionModels.content.content) -->
        <template>
          <span
            class="exam-content"
            v-for="(content, indexContent) in questions.content.content"
            :key="'exam-content' + indexContent"
          >
            <template>
              <span class="optionNum"> </span>
              <!-- 文本 -->
              <template v-if="[0].includes(content.contentType)">
                <span>{{ content.contentValue }}</span>
              </template>

              <!-- 图片 -->
              <template v-if="[1].includes(content.contentType)">
                <el-image
                  style="width: 300px;"
                  fit="contain"
                  :src="baseURL + content.contentValue"
                ></el-image>
              </template>

              <!-- 音频 -->
              <template v-if="[2].includes(content.contentType)">
                <audio :src="baseURL + content.contentValue" controls></audio>
              </template>

              <!-- 视频 -->
              <template v-if="[3].includes(content.contentType)">
                <video :src="baseURL + content.contentValue" controls></video>
              </template>

              <!-- 富文本 markdown 发音文本 -->
              <template v-if="[4, 5, 6].includes(content.contentType)">
                <div v-html="content.contentValue" />
              </template>
            </template>
          </span>
        </template>

        <!-- questionModels.answerContent-->
        <template>
          <p style="color:red" v-if="questions.answerContent.length > 1">
            标准答案:
            <span
              class="exam-answerContent"
              v-for="(item, indexAnswerContent) in questions.answerContent"
              :key="'exam-answerContent' + indexAnswerContent"
            >
              <el-row type="flex" align="middle">
                <template v-if="item.value">
                  <div style="color:blue;margin-right:5px">
                    {{ item.value }}
                  </div>
                </template>
                <template v-else>
                  <div style="color:blue;">{{ item.value }}</div>
                </template>
                <template v-if="item.detail">
                  <p style="color:red">{{ item.detail.contentValue }}</p>
                </template>
              </el-row>
            </span>
          </p>
          <!-- <p v-else>
            标准答案:
            <span
              class="exam-answerContent"
              v-for="(item, indexAnswerContent) in questions.answerContent"
              :key="'exam-answerContent' + indexAnswerContent"
            >
              <el-row type="flex" align="middle">
                <template v-if="item.value">
                  <div style="color:blue">
                    {{ item.value }}
                  </div>
                </template>
                <template v-else>
                  <div style="color:blue;">{{ item.value }}</div>
                </template>
                <template v-if="item.detail">
                  <p style="color:red">{{ item.detail.contentValue }}</p>
                </template>
              </el-row>
            </span>
          </p> -->

          <span
            class="exam-answerContent"
            v-for="(item, indexAnswerContent) in questions.answerContent"
            :key="'exam-answerContent' + indexAnswerContent"
          >
            <template v-if="questions.answerContent.length > 1 && item.value">
              <div style="color:blue">
                <!-- {{ indexAnswerContent + 1 }}: {{ item.value }} -->
                <!-- {{ item.value }} -->
              </div>
            </template>
            <template v-else>
              <!-- <div style="color:blue;">{{ item.value }}</div> -->
            </template>
            <template v-if="item.detail">
              <!-- <p style="color:red">{{ item.detail.contentValue }}</p> -->
            </template>
          </span>
          <hr />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as APP from "@/utils/common";

export default {
  props: {
    details: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters(["baseURL", "gobalName"])
  },
  watch: {
    details() {
      // console.log("格式化==activated", this.formatting());
      this.contentModels = this.details.contentModels;
      console.log("格式化==activated", this.formatting());
    }
  },
  created() {
    // console.log("details==试卷", this.details);
    // console.log("contentModels==试卷内容", this.details.contentModels);
    console.log("格式化==created", this.formatting());
  },
  activated() {
    // console.log("格式化==activated", this.formatting());
    // this.groupHandler(this.contentModels);
  },
  mounted() {
    // console.log("格式化==activated", this.formatting());
  },
  data() {
    return {
      contentModels: this.details.contentModels
      // group: this.details.contentModels.group,
      // content: this.details.contentModels.content,
      // answerContent: this.details.contentModels.answerContent
    };
  },
  filters: {},
  methods: {
    formatting() {
      // group 标题处理
      this.groupHandler(this.contentModels);
    },
    decodeURI(val) {
      return decodeURIComponent(val);
    },
    getHtml(val) {
      // 解码
      let decodeVal = this.decodeURI(val);
      // 转markdown
      return APP.markedText(decodeVal);
    },
    groupHandler(arr) {
      console.log("处理==group==", arr);

      arr.map((i, index) => {
        console.log(
          "第",
          index + 1,
          "开始--------------------------------------------"
        );
        // console.log(i.questionModels.group);
        console.log("试题列表", i);
        // 大题目 questionModels
        i.questionGroupModels.map(groupModels => {
          console.log(groupModels);
          // 0 文本
          if (groupModels.contentType === 0) {
            groupModels.contentValue = this.decodeURI(groupModels.contentValue);
          }
          // 为5 解析
          if (groupModels.contentType === 5) {
            groupModels.contentValue = this.getHtml(groupModels.contentValue);
          }
        });

        // 试题列表 questionModels
        i.questionModels.map(questionModels => {
          console.log("试题列表=>questionModels=>group", questionModels);
          // group
          questionModels.group.content.map(group => {
            // 0 文本
            if (group.contentType === 0) {
              group.contentValue = this.decodeURI(group.contentValue);
            }
            // 为5 解析
            // if (group.contentType === 5) {
            //   group.contentValue = this.getHtml(group.contentValue);
            // }
            if ([4, 5, 6].includes(group.contentType)) {
              group.contentValue = this.getHtml(group.contentValue);
            }
          });
        });

        // content
        // i.questionModels.map(questionModels => {
        //   console.log("试题列表=>questionModels=>content", questionModels);

        //   // 0 文本
        //   questionModels.content.content.map(content => {
        //     if (content.contentType === 0) {
        //       content.contentValue = this.decodeURI(content.contentValue);
        //     }
        //     // 为5 解析
        //     if (content.contentType === 5) {
        //       content.contentValue = this.getHtml(content.contentValue);
        //     }
        //   });
        // });

        // content
        i.questionModels.map(questionModels => {
          console.log("试题列表=>questionModels=>content", questionModels);
          if (questionModels.content.content.length > 0) {
            // content
            questionModels.content.content.map(content => {
              console.log("content=>content", content);
              // 0 文本
              if (content.contentType === 0) {
                content.contentValue = this.decodeURI(content.contentValue);
              }
              // 为5 解析
              if (content.contentType === 5) {
                content.contentValue = this.getHtml(content.contentValue);
              }
            });
          }
          if (questionModels.content.optionList.length > 0) {
            // optionList
            questionModels.content.optionList.map(optionList => {
              console.log("content=>optionList", optionList);
              if (optionList.contentType === 0) {
                optionList.contentValue = this.decodeURI(
                  optionList.contentValue
                );
              }
              // 为5 解析
              if (optionList.contentType === 5) {
                optionList.contentValue = this.getHtml(optionList.contentValue);
              }
            });
          }
        });

        // answerContent
        i.questionModels.map(questionModels => {
          console.log(
            "试题列表=>questionModels=>answerContent",
            questionModels
          );

          // 0 文本
          questionModels.answerContent.map(answerContent => {
            console.log();
            if (answerContent.detail.contentType === 0) {
              answerContent.detail.contentValue = this.decodeURI(
                answerContent.detail.contentValue
              );
            }
            // 为5 解析
            if (answerContent.detail.contentType === 5) {
              answerContent.detail.contentValue = this.getHtml(
                answerContent.detail.contentValue
              );
            }
          });
        });

        console.log(
          "第",
          index + 1,
          "结束--------------------------------------------"
        );
      });

      // arr.group.content.map(i => {
      //   // console.log(i);
      //   if (i.contentType === 0) {
      //     i.contentValue = this.getHtml(i.contentValue);
      //   }
      // });
      // console.log("处理完成group", arr);
      // return arr;
    }
  }
};
</script>

<style lang="scss">
.paper-require-name {
  position: relative;
}
.paper-require-type {
  left: 0;
  position: absolute;
}
.paper-total-number {
  right: 0;
  position: absolute;
}
</style>
