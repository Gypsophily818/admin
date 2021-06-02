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
      v-for="(contents, indexs) in contentModels"
      :key="indexs"
      style="font-weight: normal;"
    >
      <!-- 判断是头部标题样式 -->
      <template v-if="contents.questionGroupType == 1">
        <div class="topic-header-style">
          <span>{{ contents.topic }}</span>
        </div>
      </template>
      <template v-else>
        <div class="paper-font-middle">
          <span class="exam-title-left">{{ contents.serialNumberSymbol }}</span>
          <span class="exam-title-right">{{ contents.topic }}</span>
        </div>
      </template>

      <!-- 题干扩展 -->
      <template v-if="contents.topicExtension">
        <!-- 题干扩展是文本 -->
        <template
          v-if="
            contents.topicExtension.contentType === 0 &&
              contents.topicExtension.contentValue
          "
        >
          <div>
            <span class="textBox1 paper-font-middle">
              {{ contents.topicExtension.contentValue | decodeURI }}
            </span>
          </div>
        </template>

        <!-- 题干扩展是图片 -->
        <template
          v-if="
            contents.topicExtension.contentType === 1 &&
              contents.topicExtension.contentValue
          "
        >
          <div>
            <el-image
              :src="baseURL + contents.topicExtension.contentValue"
              class="objPicture"
            ></el-image>
          </div>
        </template>

        <!-- 题干扩展是音频 -->
        <template
          v-if="
            contents.topicExtension.contentType === 2 &&
              contents.topicExtension.contentValue
          "
        >
          <div class="flex justify-between audio-box">
            <audio
              autoplay
              controls
              :src="baseURL + contents.topicExtension.contentValue"
            ></audio>
            <div class="flex audio-silder"></div>
          </div>
        </template>
      </template>

      <!-- 试题列表questionModels -->
      <div
        class="exam-questionModels"
        v-for="(questions, indexs1) in contents.questionModels"
        :key="indexs1"
        style="background:lightblue"
      >
        <!-- 题目【对象】_带序号 -->
        <template v-if="questions.content.singleContent">
          <!-- 题目是文本_带序号 -->
          <template
            v-if="
              questions.content.singleContent.contentType === 0 &&
                questions.content.singleContent.contentValue
            "
          >
            <div>
              <!-- 题目是文本_带序号{{ questions.content.singleContent.contentValue }} -->
              <span class="textBox font32">
                <span v-if="(questions.numberSymbol || 0) != 0">
                  {{ questions.numberSymbol }}.
                </span>
                <span>
                  {{ questions.content.singleContent.contentValue | decodeURI }}
                </span>
              </span>
            </div>
          </template>

          <!-- 题目是图片_带序号 -->
          <template
            v-if="
              questions.content.singleContent.contentType === 1 &&
                questions.content.singleContent.contentValue
            "
          >
            <div class="flex optionBox">
              <div class="optionNum" v-if="(questions.numberSymbol || 0) != 0">
                {{ questions.numberSymbol }}.
              </div>
              <image
                class="objPicture"
                :src="baseURL + questions.content.singleContent.contentValue"
              ></image>
            </div>
          </template>

          <!-- 题目是音频_带序号 -->
          <template
            v-if="
              questions.content.singleContent.contentType === 2 &&
                questions.content.singleContent.contentValue
            "
          >
            <audio
              autoplay
              controls
              :src="baseURL + contents.topicExtension.contentValue"
            ></audio>
            <div class="flex justify-between audio-box"></div>
          </template>
        </template>

        <!-- 题目扩展【数组】-->
        <template>
          <!-- v-if="questions.content.contentExtension.length > 0" -->
          <div class="gridBox">
            <div
              v-for="(item, indexs2) in questions.content.contentExtension"
              :key="indexs2"
            >
              <!-- 题目扩展【数组】是文本-->
              <template v-if="item.contentType === 0 && item.contentValue">
                <span class="textBox font28">
                  {{ item.contentValue | decodeURI }}
                </span>
              </template>

              <!-- 题目扩展【数组】是图片[九宫格]-->
              <template v-if="item.contentType === 1 && item.contentValue">
                <div
                  class="bgImg"
                  :style="[
                    { backgroundImage: 'url(' + item.contentValue + ')' }
                  ]"
                ></div>
              </template>

              <!-- 题目扩展【数组】是音频-->
              <template v-if="item.contentType === 2 && item.contentValue">
                <div class="audio-box">
                  <div class="audio-silder">
                    <div class="text-silder">
                      <!-- {{ playTimeObj[contents.id] || defaultPlayTime }} -->
                      <h3>题目扩展【数组】是音频</h3>
                    </div>
                    <!-- <div class="text-silder">{{ durationAudio }}</div> -->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>

        <!-- 单词释义 -->
        <template>
          <span v-if="!!questions.linkWord" class="margin-xs font32">
            {{ questions.linkWord }}
          </span>
          <span v-if="!!questions.soundMark" class="margin-xs font32">
            {{ questions.soundMark }}
          </span>
        </template>

        <!-- questionModels.group.content-->
        <template v-if="questions">
          <span
            class="gridBox-List font30"
            v-for="(item, indexGroupContent) in questions.group.content"
            :key="indexGroupContent"
          >
            <template>
              <div style="background-color:lightgreen">
                {{ item.contentValue | decodeURI }}
              </div>
            </template>
          </span>
        </template>

        <!-- questionModels.content.content-->
        <!-- <template>
          <span
            class="gridBox-List font30"
            v-for="(item, indexContent) in questions.content.content"
            :key="indexContent"
          >
            <template>
              <span class="optionNum">
              </span>
              <p>
                {{ item.contentValue | decodeURI }}
              </p>
            </template>
          </span>
        </template> -->

        <!-- questionModels.answerContent-->
        <template>
          <span
            class="gridBox-List font30"
            v-for="(item, indexAnswerContent) in questions.answerContent"
            :key="indexAnswerContent"
          >
            <template>
              <p style="color:red">
                <!-- 答案:{{ item.detail.contentValue | decodeURI }} -->
                答案:{{ item.detail | decodeURI }}
              </p>
            </template>
          </span>
        </template>

        <!-- 选项 【数组】_带序号-->
        <template>
          <!-- v-if="questions.content.optionList.length > 0" -->
          <span
            class="gridBox-List font30"
            v-for="(item, indexs3) in questions.content.optionList"
            :key="indexs3"
          >
            <!-- 选项是文本 -->
            <template
              v-if="
                item.optionDetail.contentType === 0 &&
                  item.optionDetail.contentValue
              "
            >
              <!-- 选项序号：除了填空题，其他都呈现 -->
              <span
                v-if="[1, 2, 3, 7].includes(questions.answerType)"
                class="optionNum"
              >
                <!-- {{ item.optionName }}. -->
                <!-- <div style="color:blue">{{ item }}</div> -->
              </span>
              <p>
                {{ item.optionDetail.contentValue | decodeURI }}
              </p>
            </template>

            <!-- 选项是图片带序号呈现flex -->
            <template
              v-if="
                item.optionDetail.contentType === 1 &&
                  item.optionDetail.contentValue
              "
            >
              <div class="optionBox">
                <div class="optionNum">{{ item.optionName }}.</div>
                <image
                  class="arrPicture"
                  :src="baseURL + item.optionDetail.contentValue"
                ></image>
              </div>
            </template>

            <!-- 选项是音频带序号呈现 -->
            <template></template>
          </span>
        </template>

        <!-- 提示 -->
        <template v-if="questions.prompt">
          <!-- 提示是文本 -->
          <template
            v-if="
              questions.prompt.contentType === 0 &&
                questions.prompt.contentValue
            "
          >
            <span class="textBox font30"
              >{{ questions.prompt.contentValue }}
            </span>
          </template>

          <!-- 提示是图片 -->
          <template
            v-if="
              questions.prompt.contentType === 1 &&
                questions.prompt.contentValue
            "
          >
            <image
              class="objPicture"
              :src="baseURL + questions.prompt.contentValue"
            ></image>
          </template>
          <!-- 提示是音频 -->
          <template
            v-if="
              questions.prompt.contentType === 2 && result.prompt.contentValue
            "
          >
            <div class="audio-box">
              <div class="flex audio-silder">
                <div class="text-silder"></div>
                <div class="text-silder">
                  <h2>{{ "提示是音频" }}</h2>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    details: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters(["baseURL", "gobalName"]),
    contentModels() {
      return this.details.contentModels;
    }
  },
  filters: {
    decodeURI(url) {
      if (url) return decodeURIComponent(url);
    }
  }
};
</script>

<style></style>
