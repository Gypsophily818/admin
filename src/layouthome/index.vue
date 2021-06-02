<template>
  <div class="Enliten">
    <Header />
    <el-container>
      <ContentWrapper />
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import ContentWrapper from "./components/contentWrapper.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "Layouthome",
  components: {
    Header,
    ContentWrapper,
    Footer
  }
};
</script>
<style src="../../node_modules/bootstrap/dist/css/bootstrap.css" scoped></style>;
<style lang="scss" >
.Enliten {
  .el-container {
    .banner-wrapper {
    }
  }
  .el-footer {
    width: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
