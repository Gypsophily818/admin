<template>
  <div class="setMeatIntroduce">
    <MeatIntroduce :meatObj="meatObj" />
  </div>
</template>

<script>
import MeatIntroduce from "@/layouthome/components/meatintroduce/MeatIntroduce.vue";

export default {
  components: {
    MeatIntroduce,
  },
  data() {
    return {
      meatObj: [
        {
          title: "入门版", //版本
          custom: false,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额：",
              capacities: 10, //用户名额
              add: 0, //赠送名额
            },
            {
              text: "教师使用名额：",
              capacities: "不限量",
            },
            {
              text: "练习册积分：",
              capacities: 5000, //练习册积分
              ID: "poiont",
            },
          ],
          addCapacities: false, //赠送名额
          serviceLists: [
            //服务具体内容
            "提供软件平台三端",
            "提供三端使用培训",
            "提供教师能力培训 I (2小时)",
            "提供英语教学培训 I (2小时)",
            "提供运营能力培训 I (2小时)",
            "赠送 1 年品牌定制 (教师/学生端 logo 轮播图)",
          ],
        },
        {
          title: "标准版", //版本
          custom: false,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额：",
              capacities: 50, //用户名额
              add: 10, //赠送名额
            },
            {
              text: "教师使用名额：",
              capacities: "不限量",
            },
            {
              text: "练习册积分：",
              capacities: 20000, //练习册积分
            },
          ],
          addCapacities: true, //赠送名额
          addMember: 10,
          serviceLists: [
            //服务具体内容
            "提供软件平台三端",
            "提供三端使用培训",
            "提供教师能力培训 II (2小时)",
            "提供英语教学培训 II (2小时)",
            "提供运营能力培训 II (2小时)",
            "提供招生策略指导 I ",
            "获赠 10 套漫画版《词汇析由记》【原创出版书籍】",
          ],
        },
        {
          title: "增强版", //版本
          custom: false,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额：",
              capacities: 100, //用户名额
              add: 30, //赠送名额
            },
            {
              text: "教师使用名额：",
              capacities: "不限量",
            },
            {
              text: "练习册积分：",
              capacities: 50000, //练习册积分
            },
          ],
          addCapacities: true, //赠送名额
          addMember: 30,
          serviceLists: [
            //服务具体内容
            "提供软件平台三端",
            "提供三端使用培训",
            "提供教师能力培训 III (4小时)",
            "提供英语教学培训 III (4小时)",
            "提供运营能力培训 III (4小时)",
            "提供招生策略指导 II (4小时)",
            "获赠 20 套漫画版《词汇析由记》【原创出版书籍】",
          ],
        },
        {
          title: "旗舰版", //版本
          custom: false,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额：",
              capacities: 200, //用户名额
              add: 100, //赠送名额
            },
            {
              text: "教师使用名额：",
              capacities: "不限量",
            },
            {
              text: "练习册积分：",
              capacities: 100000, //练习册积分
            },
          ],
          addCapacities: true, //赠送名额
          addMember: 100,
          serviceLists: [
            //服务具体内容
            "提供软件平台三端",
            "提供三端使用培训",
            "提供英语教学培训 IV (3天)",
            "沟通技巧培训 I (4小时)",
            "提供运营现状指导 I (4小时)",
            "提供营销招生定制 I (4小时)",
            "人员招聘指导 I (2小时)",
            "效益提升指导 I (2小时)",
            "获赠 50 套漫画版《词汇析由记》【原创出版书籍】",
            "获赠导入 5 本定制练习册 【自选书籍资料】",
          ],
        },
        {
          title: "钻石版", //版本
          custom: false,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额：",
              capacities: 200, //用户名额
              add: 400, //赠送名额
            },
            {
              text: "教师使用名额：",
              capacities: "不限量",
            },
            {
              text: "练习册积分：",
              capacities: 300000, //练习册积分
            },
          ],
          addCapacities: true, //赠送名额
          addMember: 400,
          serviceLists: [
            //服务具体内容
            "提供软件平台三端",
            "提供三端使用培训",
            "提供英语教学培训 V (5天)",
            "提供提分技巧培训 I (4小时)",
            "提供学生管理培训 I (4小时)",
            "提供运营现状诊断 I (8小时)",
            "提供招生策略指导 I (2小时)",
            "提供运营现状指导 II (4小时)",
            "提供效益提升指导 II (4小时)",
            "提供人员招聘指导 II",
            "获赠 100 套漫画版《词汇析由记》【原创出版书籍】",
            "获赠导入 5 本定制练习册 【自选书籍资料】 ",
            "获赠定制学生端小程序 1 个",
          ],
        },
        {
          title: "定制版", //版本
          custom: true,
          userCapactiesLists: [
            //用户名额列表
            {
              text: "学生用户名额 100 个起订",
              add: "咨询客服有大礼", //赠送名额
            },
            {
              text: "获得不限量教师使用名额",
            },
            {
              text: "获得 50,000 练习册积分（按需选用）",
            },
          ],
          addCapacities: true, //赠送名额
          addMember: "咨询客服有大礼",
          serviceLists: [
            //服务具体内容
            "教师能力培训定制",
            "英语教学培训定制",
            "提分技巧培训定制",
            "学生管理培训定制",
            "运营能力培训定制",
            "运营现状诊断定制",
            "运营现状指导定制",
            "招生策略指导定制",
            "营销招生定制定制",
            "营销招生培训定制",
            "沟通技巧培训定制",
            "人员招聘指导定制",
            "人员招聘培训定制",
            "管理能力培训定制",
            "管理能力实操定制",
            "效益提升指导定制",
            "软件平台三端定制",
            "其他需求定制",
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.setMeatIntroduce {
}
</style>
