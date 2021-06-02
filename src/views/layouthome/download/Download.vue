<template>
  <div class="download">
    <DownloadItem :downloadObj="downloadObj" />
  </div>
</template>

<script>
import DownloadItem from "@/layouthome/components/download/DownloadItem.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    DownloadItem
  },
  computed: {
    ...mapGetters(["toDownloadID"])
  },
  data() {
    return {
      downloadObj: [
        {
          userID: "111",
          title: "进名校(学生端)",
          describe: "成绩提升系统",
          QR_text: "扫一扫下载软件",
          QR_codeImg: require("@/assets/download/studentApp_QRcode.png"),
          edition: "2.2.62",
          lastUpdate: "2021-03-27 17:45",
          sketchImg: require("@/assets/download/studentApp_logo.png")
        },
        {
          userID: "222",
          title: "进名校教师端",
          describe: "智能批改系统",
          QR_text: "扫一扫进入小程序",
          QR_codeImg: require("@/assets/download/teacherApp_QRcode.png"),
          edition: "1.12.2",
          lastUpdate: "2021-03-27 14:45",
          sketchImg: require("@/assets/download/teacherApp_logo.png")
        },
        {
          userID: "333",
          title: "进名校管理端",
          describe: "数据管理系统",
          QR_text: "扫一扫进入小程序",
          QR_codeImg: require("@/assets/download/managerApp_QRcode.png"),
          edition: "2.3.2",
          lastUpdate: "2021-03-27 16:45",
          sketchImg: require("@/assets/download/managerApp_logo.png")
        }
      ]
    };
  },
  created() {
    //创建时执行跳转锚点位置
  },
  watch: {
    toDownloadID(n) {
      console.log("toDownloadID刷新", n);
      this.$nextTick(() => {
        this.getlocal(n);
      });
    }
  },
  mounted: function() {
    let that = this;
    that.$nextTick(function() {
      window.addEventListener("scroll", that.handleScroll);
    });
  },
  methods: {
    //从我本地找到id
    getlocal(n) {
      //找到锚点id
      // let selectId = localStorage.getItem("toId");
      // let toElement = document.getElementById(selectId);
      let toElement = document.getElementById(n);
      // id存到本页
      // this.toDownloadID = selectId;
      // this.$store.commit("updateDownloadID", selectId);
      //如果对应id存在，就跳转
      // if (selectId) {
      // toElement.scrollIntoView();
      // }
      setTimeout(() => {
        toElement.scrollIntoView();
      }, 300);
    }
  },
  //离开页面进行对localStorage  id销毁，避免其他入口进来有锚点问题
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        let toId = localStorage.getItem("toId");
        if (toId) {
          vm.getlocal(toId);
        }
      });
    });
  },
  beforeRouteLeave(to, form, next) {
    localStorage.setItem("toId", "");
    next();
  }
};
</script>

<style lang="scss" scoped>
.download {
}
</style>
