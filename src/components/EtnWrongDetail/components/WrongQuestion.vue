<template>
  <!-- 错题展示-->
  <div class="error-detail" v-if="question">
    <!-- group 标题 -->
    <div
      class="grop"
      v-for="(item, index) in group.content"
      :key="'grop' + index"
    >
      <el-row type="flex" align="middle">
        <!-- 文本 -->
        <template v-if="[0].includes(item.contentType)">
          <span>{{ item.contentValue }}</span>
          <!-- <div v-html="item.contentValue" /> -->
        </template>
        <!-- 图片 -->
        <template v-else-if="[1].includes(item.contentType)">
          <!-- <el-image :size='' :src="baseURL + item.contentValue"></el-image> -->
        </template>
        <template v-else>
          <div v-html="item.contentValue" />
        </template>
      </el-row>
    </div>

    <!-- content 内容 -->
    <div
      class="content"
      v-for="(item, index) in content.content"
      :key="'content' + index"
    >
      <!-- content -->
      <el-row type="flex" align="middle">
        <!-- 文本 -->
        <template v-if="[0, 4, 5, 6].includes(item.contentType)">
          <div v-html="item.contentValue" />
        </template>
        <!-- 图片 -->
        <template v-if="[1].includes(item.contentType)">
          <div v-html="item.contentValue" />
        </template>
        <!-- 音 -->
        <template v-if="[2].includes(item.contentType)">
          <audio :src="baseURL + item.contentValue" controls></audio>
        </template>
        <!-- 頻 -->
        <template v-if="[3].includes(item.contentType)">
          <video :src="baseURL + item.contentValue" controls></video>
        </template>
      </el-row>
    </div>

    <div
      class="optionList"
      v-for="(item, index) in content.optionList"
      :key="'optionList' + index"
    >
      <!-- optionList -->

      <el-row type="flex" align="middle">
        <span>{{ item.optionName }}.</span>
        <!-- 文本 -->
        <template v-if="[0, 4, 5, 6].includes(item.optionDetail.contentType)">
          <div v-html="item.optionDetail.contentValue" />
        </template>
        <!-- 图片 -->
        <template v-if="[1].includes(item.optionDetail.contentType)">
          <div v-html="item.optionDetail.contentValue" />
        </template>
        <!-- 音 -->
        <template v-if="[2].includes(item.optionDetail.contentType)">
          <audio
            :src="baseURL + item.optionDetail.contentValue"
            controls
          ></audio>
        </template>
        <!-- 頻 -->
        <template v-if="[3].includes(item.optionDetail.contentType)">
          <video
            :src="baseURL + item.optionDetail.contentValue"
            controls
          ></video>
        </template>
        <!-- <template v-if="item.optionDetail.contentValue">
          <div v-html="item.optionDetail.contentValue" />
        </template> -->
      </el-row>
    </div>
    <!-- answerContent 答案 -->
    <el-tag>标准答案:</el-tag>
    <el-card class="box-card error-card">
      <div
        class="answerContent"
        v-for="(item, index) in answerContent"
        :key="'answerContent' + index"
      >
        <el-row type="flex" align="middle">
          <span style="margin-right:5px"> {{ item.value }}</span
          >&nbsp;
          <template v-if="item.detail">
            <template v-if="item.detail.contentValue">
              <div v-html="item.detail.contentValue" />
            </template>
          </template>
        </el-row>
      </div>
    </el-card>

    <!-- <template v-if="question.userAnswerContent">
      <div class="userAnswerContent" v-html="userAnswerContent" />
    </template> -->

    <!-- <h2>markdown:</h2>
    <div>{{ question.content.content[0].contentValue | decodeURI }}</div> -->
    <!-- <div v-html="decodeURI(question.content.content[0].contentValue)"></div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as APP from "@/utils/common";
// import marked from "marked";

export default {
  components: {
    // MarkdownEditor
  },
  props: {
    showCode: {
      type: Number,
      default: 1
    },
    question: {
      type: Object,
      default: () => ({})
    }
    // question:{}
  },
  computed: {
    ...mapGetters(["baseURL"])
  },
  filters: {},
  created() {
    // console.log("group==", this.group);
    console.log("userAnswerContent==", this.userAnswerContent);
    this.formatting();
  },
  data() {
    return {
      group: this.question.group,
      content: this.question.content,
      answerContent: this.question.answerContent,
      userAnswerContent: this.question.userAnswerContent
    };
  },
  methods: {
    formatting() {
      // group 标题处理
      this.groupHandler(this.group);
      // content 内容处理
      this.contentHandler(this.content);
      // answerContent 答案内容处理
      this.answerContentHandler(this.answerContent);
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
      arr.content.map(i => {
        // console.log(i);
        if (i.contentType === 0) {
          // 文本 直接decode 解析
          i.contentValue = this.decodeURI(i.contentValue);
        }
        // 富文本  decode + marked
        if ([5].includes(i.contentType)) {
          i.contentValue = this.getHtml(i.contentValue);
        }
      });
      console.log("处理完成group", arr);
      return arr;
    },
    contentHandler(arr) {
      // [0=Text(文本)],[1=Image(图片)],[2=Audio(音频)],[3=Video(视频)]
      // [4=RichText(富文本)],[5=MarkDown(MarkDown)],[6=PronunciationText(发音文本)]

      console.log("处理==content==", arr);
      // content
      arr.content.map(item => {
        // console.log(i);
        if ([0, 5].includes(item.contentType)) {
          //
          console.log("正在处理==content==content", item);
          item.contentValue = this.getHtml(item.contentValue);
          // console.log(item.contentValue);
        }
      });
      // optionList
      arr.optionList.map(i => {
        // console.log(i);
        if ([0, 5].includes(i.optionDetail.contentType)) {
          console.log("正在处理==content==optionList", i);
          i.optionDetail.contentValue = this.getHtml(
            i.optionDetail.contentValue
          );
        }
      });
      console.log("处理完成content", arr);
      return arr;
    },
    answerContentHandler(arr) {
      console.log("处理==answerContent==", arr);
      arr.map(i => {
        if (i.detail && i.detail.contentType === 0) {
          console.log("正在处理==answerContent==", i);
          i.detail.contentValue = this.getHtml(i.detail.contentValue);
        }
      });
      console.log("处理完成answerContent", arr);
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped></style>
