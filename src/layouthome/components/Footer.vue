<template>
  <el-container class="footer">
    <div class="container">
      <el-row>
        <el-col :xs="24" :sm="12">
          <div class="contact">
            <ul class="footer-text">
              <li><span class="contect-title">联系我们</span></li>
              <li>
                <div class="imgwrapper">
                  <img src="@/assets/footer/phone.png" />
                </div>
                <span>18520143544</span>
              </li>
              <li>
                <div class="imgwrapper">
                  <img src="@/assets/footer/email.png" />
                </div>
                <span>service@shenshidao.com</span>
              </li>
              <li>
                <div class="imgwrapper">
                  <img src="@/assets/footer/location.png" />
                </div>
                <span>广东省佛山市顺德区北滘镇顺德碧桂园北八路八号</span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12">
          <div class="download">
            <el-row>
              <el-col :xs="24">
                <ul class="footer-text">
                  <li>
                    <span class="download-app-title">移动客户端下载</span>
                  </li>
                  <li>
                    <span class="app-items" @click="goto('/download', 111)"
                      >进名校 (学生端)</span
                    >
                  </li>
                  <li>
                    <span class="app-items" @click="goto('/download', 222)"
                      >进名校教师端</span
                    >
                  </li>
                  <li>
                    <span class="app-items" @click="goto('/download', 333)"
                      >进名校机构端</span
                    >
                  </li>
                </ul>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col>
          <div class="copyright" :xs="24">
            <div class="copyright-ICP" @click="toICP" style="cursor: pointer">
              粤ICP备18040417号
            </div>
            <div class="copyright-company">
              ©2021 英乐腾教育科技(广州)有限公司
            </div>
          </div>
          <el-backtop :bottom="100">
            <div
              style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
            >
              <!-- UP -->
              <i class="el-icon-top"></i>
            </div>
          </el-backtop>
        </el-col>
      </el-row>
    </div>
  </el-container>
</template>

<script>
// import { mapMutations } from "vuex";
export default {
  methods: {
    goto(page, selectId) {
      localStorage.setItem("toId", selectId);
      this.$router.push({ path: page });
      this.$store.commit("user/updateDownloadID", selectId);
    },
    toICP() {
      window.location.replace("https://beian.miit.gov.cn/#/Integrated/index");
    }
  }
};
</script>
<style
  src="../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style
>;

<style
  scoped
  src="../../../node_modules/bootstrap/dist/css/bootstrap.css"
></style
>;
<style lang="scss" scoped>
.footer {
  background-color: #1b2327;
  color: #ffffff;
  font-size: 16px;
  .container {
    padding-top: 80px;
    .footer-text li {
      height: 32px;
      line-height: 32px;
      list-style: none;
      .contect-title {
        font-weight: 600;
      }
      .imgwrapper {
        display: inline-block;
        text-align: center;
        width: 30px;
        margin-right: 8px;
        img {
          vertical-align: middle;
        }
      }
    }
    .contact {
      text-align: left;
      cursor: pointer;
    }
    .download {
      display: flex;
      flex-direction: row-reverse;
      text-align: left;
      .download-app-title {
        font-weight: 600;
      }
      .app-items {
        font-size: 14px;
        &:hover {
          color: #1c7deb;
          cursor: pointer;
        }
      }
    }
    @media (max-width: 765px) {
      .contact {
        text-align: center;
      }
      .download {
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 30px;
      }
    }
  }
  .copyright {
    height: 146px;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;
    padding-bottom: 8px;
    [class^="copyright"] {
      font-size: 0.875rem;
      font-weight: 400;
      color: #fff;
    }
  }
  .el-backtop {
    div {
      border-radius: 50%;
    }
  }
}
</style>
