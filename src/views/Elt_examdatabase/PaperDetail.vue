<template>
  <div class="app-container">
    <!-- paperCode=1 题库试卷展示  -->
    <!-- <EtnPaperDetail v-if="paperList" :details="paperList" :paperCode="1" /> -->
    <EtnPaperDetail v-if="paperList" :details="paperList" />
  </div>
</template>

<script>
import { getProductPaperDetail } from "@/api/book";
import EtnPaperDetail from "@/components/EtnPaperDetail";
import { mapGetters } from "vuex";
export default {
  name: "PaperDetail",
  components: { EtnPaperDetail },
  computed: {
    ...mapGetters(["baseURL"])
  },
  filters: {
    decodeURI(url) {
      if (url) return decodeURIComponent(url);
    }
  },
  data() {
    return { paperList: null, paperListContent: null };
  },
  created() {
    let paperId = this.$route.query.paper;
    if (paperId) {
      this.getPaperDetail(paperId);
      console.log("created==>", this.$route.query.paper);
    }
    // this.paperList = JSON.parse(localStorage.getItem("paper"));
    // this.paperList = this.paperList.result;
    // console.log("paperList==>", this.paperList);

    // this.paperListContent = this.paperList.contentModels;
    // console.log("paperListContent==>", this.paperListContent);
  },
  activated() {
    let paperId = this.$route.query.paper;
    if (paperId) {
      this.getPaperDetail(paperId);
      console.log("activated==>", this.$route.query.paper);
    }
  },
  methods: {
    async getPaperDetail(id) {
      const res = await getProductPaperDetail({ testpaperSerialNo: id });
      console.log(res);
      if (res.success) {
        this.paperList = res.result;
        console.log("paperList==>", this.paperList);

        // window.localStorage.setItem("paper", JSON.stringify(res));
      }
      if (res.error) {
        this.$message.error(res.error || "网络出错~");
      }
    }
  }
};
</script>
