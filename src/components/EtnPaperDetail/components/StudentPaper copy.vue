<template>
  <div>
    <el-row>
      <!-- 试卷头部信息-->
      <el-card class="box-card" v-if="details">
        <div slot="header" class="clearfix">
          <el-row>
            <el-col style="text-align:center">
              <span>
                {{ details.testPaperName }}
              </span>
              <header>
                <svg-icon icon-class="start" />{{
                  details.testPaperRequireTypeName
                }}
              </header>
            </el-col>
            <el-col :span="12" style="text-align:left">
              <span class="paper-status">
                <el-tag :type="details.isItPassable ? 'success' : 'danger'">
                  {{ details.isItPassable ? "通过" : "未通过" }}
                </el-tag>
              </span>
            </el-col>
            <el-col :span="12" style="text-align:right">
              <span class="check-error">只看错题</span>
              <el-switch
                v-model="isOnlyWrong"
                active-color="#13ce66"
              ></el-switch>
            </el-col>
          </el-row>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="8" class="text-center">
            <!-- 正确率 -->
            <span>{{ gobalName.Paper_Correct }}:</span>
            <p>
              {{ details.passableRate }}
            </p>
          </el-col>

          <el-col :span="8" class="text-center">
            <!-- 所花时长 -->
            <span class="pass-rate">试卷所花时长:</span>
            <p>
              {{ details.finishedDuration }}
            </p>
          </el-col>

          <el-col :span="8" class="text-center">
            <span>当前回合:</span>
            <p>{{ details.round }}</p>
          </el-col>
        </div>
      </el-card>
    </el-row>

    <el-card class="box-card">
      <div class="text item">
        <div class="top-btnBox">
          <!-- {{ paperContentModels }} -->
          <div v-for="items in paperContentModels" :key="items.testPaperId">
            <!-- 题干内容 -->
            <!-- 判断是头部标题样式questionGroupType(1是组标题Group)，通过displayStyle控制样式状态：居左居右居中 -->
            <!-- <template v-if="items.questionGroupType==1">
                <div class="topicStyle"
                  :class="items.displayStyle.align === 0?'text-left':(items.dispalyStyle.align ===1?'text-center' : 'text-right')">
                  <div
                    :class="items.displayStyle.fontSize === 0?'font30 text-bold':(items.dispalyStyle.fontSize ===1?'font32 text-bold' : 'font36 text-bold')">
                    <div
                      :class="items.displayStyle.textStyle === 0?'fontNormal':(items.dispalyStyle.textStyle === 1?'fontItalic':(items.dispalyStyle.textStyle === 2?'fontItalic' : 'textBackground'))">
                      <div selectable="true">{{ items.topic }}</div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="pap-caption">
                  <div selectable="true" v-if="!!items.serialNumberSymbol" class="enl-title-left">
                    {{ items.serialNumberSymbol }}</div>
                  <div selectable="true" class="enl-title-right font32">{{ items.topic }}</div>
                </div>
              </template> -->

            <!-- 以上代码待优化使用js控制头部呈现样式-->
            <!-- 以上代码待优化使用js控制头部呈现样式-->
            <!-- 以上代码待优化使用js控制头部呈现样式，简单判断当questionsGroupType=1时，直接呈现-->
            <template v-if="items.questionGroupType == 1">
              <div>{{ items.topic }}</div>
            </template>
            <!-- 呈现每道题——题干-->
            <div v-else>{{ items.serialNumberSymbol }}{{ items.topic }}</div>
            <!-- 题干扩展判断：[0=Text(文本)],[1=Image(图片)],[2=Audio(音频)],[3=Video(视频)],[4=RichText(富文本)],[5=MarkDown(MarkDown)]-->
            <template v-if="!!items.topicExtension">
              <!-- 题干是文本:解码再正则判断是否有下划线-->
              <div
                v-if="
                  items.topicExtension.contentType == 0 &&
                    items.topicExtension.contentValue != ''
                "
              >
                题扩文__<span>{{ items.topicExtension.contentValue }}</span>
              </div>
              <!-- 题干是图片:拼接地址呈现图片-->
              <div
                v-if="
                  items.topicExtension.contentType == 1 &&
                    items.topicExtension.contentValue != ''
                "
              >
                <!-- element ui image -->
                <el-image
                  class="paperImg"
                  :src="
                    `https://client.homework.enliten.cn/${items.topicExtension.contentValue}`
                  "
                >
                  <template #placeholder>
                    <div class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </template>
                </el-image>
              </div>
              <!-- 题干是音频:拼接地址呈现音频-->
              <div
                v-if="
                  items.topicExtension.contentType == 2 &&
                    items.topicExtension.contentValue != ''
                "
              >
                <!-- 题扩音__{{`https://client.homework.enliten.cn/${items.topicExtension.contentValue}`}} -->
                <audio
                  :src="
                    `https://client.homework.enliten.cn/${items.topicExtension.contentValue}`
                  "
                  controls
                  autoloop
                ></audio>
              </div>
              <!-- 题干是音频:拼接地址呈现音频-->
              <div
                v-if="
                  items.topicExtension.contentType == 3 &&
                    items.topicExtension.contentValue != ''
                "
              >
                <!-- 题扩音__{{`https://client.homework.enliten.cn/${items.topicExtension.contentValue}`}} -->
                <video
                  :src="
                    `https://client.homework.enliten.cn/${items.topicExtension.contentValue}`
                  "
                  controls
                  autoloop
                ></video>
              </div>
            </template>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isOnlyWrong: {
      type: Boolean,
      default: false
    },
    details: {
      type: Object,
      default: {}
    }
  },
   computed: {
    ...mapGetters(["baseURL", "gobalName"]),
    paperContentModels() {
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
