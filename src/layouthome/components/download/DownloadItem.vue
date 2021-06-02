<template>
  <div class="blue-bg">
    <template v-for="(item, index) in downloadObj">
      <section
        class="download-apps"
        :key="index"
        :class="
          item.userID === '111'
            ? 'blue-bg'
            : item.userID === '222'
            ? 'green-bg'
            : item.userID === '333'
            ? 'orange-bg'
            : ''
        "
        :id="item.userID"
      >
        <div class="container">
          <div class="student-app row">
            <div class="app-info col-12 col-md-6">
              <h4 class="title">{{ item.title }}</h4>
              <p class="describe">{{ item.describe }}</p>
              <div class="QR-code">
                <img :src="item.QR_codeImg" alt="Qr-code" />
                <div class="QR-text">{{ item.QR_text }}</div>
              </div>

              <div class="download-btns">
                <div class="download-andriod">
                  <img src="@/assets/download/and_icon.png" alt="Android" />
                  <span class="download-btn-text">Android下载</span>
                </div>
                <div class="download-IOS">
                  <img src="@/assets/download/ios_icon.png" alt="iPhone" />
                  <span class="download-btn-text">iPhone下载</span>
                </div>
              </div>

              <div class="version">
                <div>
                  <span id="version-now">当前最新版本：</span>
                  <span class="edition">{{ item.edition }}</span>
                </div>
                <div>
                  <span id="latest-update">最后更新时间：</span>
                  <span class="lastUpdate">{{ item.lastUpdate }}</span>
                </div>
              </div>
            </div>
            <div class="app-sketch col-12 col-md-6">
              <img :src="item.sketchImg" alt="studentApp" />
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  props: ["downloadObj"],
};
</script>
<style
  src="../../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style>;

<style
  src="../../../../node_modules/bootstrap/dist/css/bootstrap.css"
  scoped></style>;
<style lang="scss">
.download-apps {
  display: flex;
  justify-content: space-between;
  .app-info {
    font-family: "PingFang SC";
    min-width: 50%;
    text-align: center;
    padding: 60px 0 100px 0;
    margin-top: 24px;
    .title {
      margin: 0;
      font-size: 76px;
      font-weight: bold;
      color: #fff;
    }
    .describe {
      margin: 0;
      padding-top: 40px;
      font-size: 50px;
      font-weight: 400;
      color: #fff;
    }
    .QR-code {
      padding-top: 80px;
      width: 180px;
      margin: 0 auto;
      img {
        width: 100%;
      }
      .QR-text {
        font-size: 22px;
        padding-top: 12px;
        color: #fff;
      }
    }
    .download-btns {
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      [class^="download"] {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .download-andriod {
        width: 250px;
        height: 60px;
        background: #0033ff;
        border-radius: 8px;
        margin-right: 14px;
      }
      .download-IOS {
        width: 240px;
        height: 60px;
        background: #2b2b2b;
        border-radius: 8px;
      }
      .download-btn-text {
        color: #fff;
        padding-left: 8px;
      }
    }
    .version {
      padding-top: 30px;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
      .title {
        width: 90vw;
        margin: 0 auto;
        text-align: center;
      }
      .describe {
        width: 90vw;
        margin: 0 auto;
        text-align: center;
      }
    }
  }
  .app-sketch {
    display: flex;
    padding-left: 60px;
    align-items: flex-end;
    position: relative;

    img {
      width: 100%;
    }
  }
}
//   学生
.blue-bg {
  background: #5665f4;
}
//   教师
.green-bg {
  background: #3dbda0;
}
//   管理
.orange-bg {
  background: #f96c50;
}
</style>
