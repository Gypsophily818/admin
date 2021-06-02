<template>
  <div class="meat">
    <div class="header">
      <h1 class="text">进名校—英语教学内容提供商</h1>
    </div>
    <section class="service-combo-wrapper container">
      <div class="service-combo">
        <p class="combo-title">选择适合您的服务套餐</p>
        <p class="combo-text">名额可邀请学生使用，积分可兑换练习册。</p>
      </div>
      <el-row>
        <el-col
          v-for="(item, index) in meatObj"
          :key="index"
          class="col-12 col-md-6 col-lg-4"
        >
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <!-- 赠送名额 -->
            <template v-if="item.addCapacities">
              <div class="combo-box">
                <p class="combo-box-title">{{ item.title }}></p>

                <!-- 非定制版 -->
                <div class="add-title" v-if="item.custom">
                  {{ item.addMember }}
                </div>

                <!-- 定制版 -->
                <div class="add-title" v-else>
                  赠送{{ item.addMember }}个学生名额
                </div>
              </div>
            </template>

            <!-- 无赠送名额 -->
            <template v-else>
              <div class="combo-box">
                <p class="combo-box-title">{{ item.title }}></p>
              </div>
            </template>

            <div class="service-info">
              <div class="user-capacity">
                <span class="service-title">用户名额</span>

                <!-- 非定制版 -->
                <template v-if="!item.custom">
                  <ul class="user-capacity-content">
                    <li
                      v-for="(i, list) in item.userCapactiesLists"
                      :key="list"
                    >
                      <span class="desc">{{ i.text }}</span>

                      <!-- 没增加名额 -->
                      <template v-if="!item.addCapacities">
                        <!-- 如果是'number' -->
                        <span
                          class="desc-text"
                          v-if="typeof i.capacities === 'number'"
                          >{{ i.capacities }}{{ i.addCapacities }}个</span
                        >
                        <!-- 否则 -->
                        <span class="desc-text" v-else>{{ i.capacities }}</span>
                      </template>

                      <!-- 有增加名额 -->
                      <template v-if="item.addCapacities">
                        <!-- 如果是'number'且'poiont(积分)' -->
                        <template v-if="i.add">
                          <span
                            class="desc-text"
                            v-if="typeof i.capacities === 'number'"
                          >
                            {{ i.capacities + i.add }}个</span
                          ><span class="isadd">{{ i.capacities }}个</span>
                        </template>
                        <template v-else>
                          <!-- 否则 -->
                          <span
                            class="desc-text"
                            v-if="typeof i.capacities === 'number'"
                            >{{ i.capacities }}{{ i.addCapacities }}个</span
                          >
                          <!-- 否则 -->
                          <span class="desc-text" v-else>{{
                            i.capacities
                          }}</span>
                        </template>
                      </template>
                    </li>
                  </ul>
                </template>

                <!-- 定制版 -->
                <template v-else>
                  <ul class="user-capacity-content">
                    <li
                      v-for="(i, li_index) in item.userCapactiesLists"
                      :key="li_index"
                    >
                      {{ i.text }}
                    </li>
                  </ul>
                </template>
              </div>
              <div class="main-service">
                <span class="service-title"
                  >{{ item.serviceLists.length }}大授权服务内容</span
                >
                <ul class="user-service-item">
                  <li v-for="(text, list) in item.serviceLists" :key="list">
                    {{ text }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="bottom clearfix">
              <el-button type="text" class="button">了解详情</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <!-- :class="{ isShow: 'show' === isshow }" -->
    <div class="customer-wechat">
      <div
        class="customer-img"
        @mouseenter="showCustomerQR"
        @mouseleave="hideCustomerQR"
      >
        <div class="customer_QR" :class="{ isShow: isshow }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["meatObj"],
  data() {
    return {
      customerImg: require("@/assets/meatIntroduce/elevtor_QR.png"),
      isshow: false,
    };
  },
  methods: {
    showCustomerQR() {
      this.isshow = !this.isshow;
    },
    hideCustomerQR() {
      this.isshow = !this.isshow;
    },
  },
};
</script>
<style
  src="../../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css"
  scoped
></style>;

<style
  src="../../../../node_modules/bootstrap/dist/css/bootstrap.css"
  scoped></style>;
<style lang="scss" scoped>
.meat {
  .header {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../../../assets/meatIntroduce/header-bg.png") 100% 100%;
    .text {
      font-size: 2.5rem;
      font-weight: bold;
      color: #fff;
      margin: 0;
    }
  }
  .service-combo-wrapper {
    margin-bottom: 40px;
    .service-combo {
      margin-top: 100px;
      margin-bottom: 80px;
      [class^="combo-"] {
        text-align: center;
      }
      .combo-title {
        font-size: 1.875rem;
        font-weight: bold;
        color: #333;
      }
      .combo-text {
        font-size: 1.5rem;
        font-weight: 300;
        color: #666;
      }
    }
    .el-row {
      .el-col {
        .el-card {
          height: 750px;
          margin-top: 40px;
          overflow: inherit;
          .combo-box {
            position: relative;
            height: 150px;
            background: linear-gradient(0deg, #4e63ff 0%, #388af0 100%);
            display: flex;
            align-items: center;
            padding-left: 30px;

            .combo-box-title {
              font-size: 1.875rem;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #fff;
            }
            .add-title {
              width: 174px;
              height: 48px;
              line-height: 48px;
              font-size: 1rem;
              text-align: center;
              color: #fff;
              font-weight: bold;
              background: linear-gradient(90deg, #ffbf20 0%, #ff722f 100%);
              box-shadow: 0px 2px 10px 0px rgba(0, 39, 188, 0.2);
              border-radius: 0px 0px 0px 27px;
              font-family: Microsoft YaHei;
              position: absolute;
              top: -10px;
              right: 0;
            }
          }
          .service-info {
            padding: 40px 0 0px 40px;
            height: 480px;
            overflow: scroll;
            overflow-x: hidden;
            overflow-y: hidden;
            ::-webkit-scrollbar {
              display: none;
            } /* Chrome Safari */

            [class^="service-title"] {
              font-size: 1.25rem;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333;
              line-height: 48px;
            }
            .user-capacity {
              text-align: left;

              .user-capacity-content {
                line-height: 48px;
                margin: 0;

                .desc {
                  color: #333;
                  font-size: 1rem;
                }
                .desc-text {
                  color: #1c7deb;
                  font-weight: bold;
                }
                .isadd {
                  text-decoration: line-through;
                  font-weight: 300;
                  color: #999;
                  margin-left: 5px;
                }
              }
            }
            .main-service {
              text-align: left;
              margin: 0;
              margin-bottom: -80px;

              .user-service-item {
                font-size: 1rem;
                font-family: Microsoft YaHei;
                font-weight: 300;
                color: #666;
                line-height: 48px;
              }
            }

            &:hover {
              overflow-y: auto;
            }
          }
          .bottom {
            width: 140px;
            height: 50px;
            background: linear-gradient(101deg, #ffc320 0%, #ff6f2f 100%);
            border-radius: 8px;
            margin: 0px auto;
            margin-top: 30px;
            margin-bottom: 60px;

            .button {
              font-size: 1.25rem;
              color: #fefefe;
              font-weight: bold;
              span {
                font-family: Microsoft YaHei;
                line-height: 48px;
              }
            }
          }
        }
      }
    }
  }
  .customer-wechat {
    position: fixed;
    right: 0;
    top: 530px;
    z-index: 10;
    width: 100px;
    height: 100px;
    .customer-img {
      width: 100px;
      height: 100px;
      background: url("../../../assets/meatIntroduce/customer.png") no-repeat;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -ms-transition: all 0.3s;
      -o-transition: all 0.3s;
      .customer_QR {
        background: url("../../../assets/meatIntroduce/elevtor_QR.png")
          no-repeat;
        background-position: 0 0;
        width: 0px;
        height: 0px;
        overflow: hidden;
        position: absolute;
        top: -64px;
        left: -171px;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
      }
      .isShow {
        width: 170px;
        height: 204px;
      }
      &:hover {
        background-position: 0px -120px;
      }
    }
  }
}
</style>
