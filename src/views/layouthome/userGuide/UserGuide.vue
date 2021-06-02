<template>
  <div class="user-guide">
    <UserGuideHeader />
    <UserGuideContent :userGuideObj="userGuideObj" />
  </div>
</template>

<script>
import UserGuideHeader from "@/layouthome/components/userGuide/UserGuideHeader.vue";
import UserGuideContent from "@/layouthome/components/userGuide/UserGuideContent.vue";

export default {
  components: { UserGuideContent, UserGuideHeader },
  data() {
    return {
      userGuideObj: [
        {
          Numtitle: "01",
          stepWays: 1,
          title: "购买名额",
          desc:
            "购买名额之后才可以添加同数额的学生账号、购买会同时获得积分，积分可用于兑换练习册商城里的练习册",
          steps: "购买名额步骤:",
          details:
            "1.点击底部【工作台】 - 2.点击【名额管理】 -3.查看剩余名额、购买名额需要联系客服",
          imgUrl: require("@/assets/userGuide/step1.jpg"),
        },
        {
          Numtitle: "02",
          stepWays: 1,
          title: "添加老师账号",
          desc: "教师账号由管理统一管理，教师账号可用于登录进名校教师端",
          steps: "添加教师账号步骤:",
          details:
            "1.点击底部【工作台】 - 2.点击【成员管理】 - 3.点击下方【新建教师账号】、注册完成后教师端可登陆此账号",
          imgUrl: require("@/assets/userGuide/step2.png"),
        },
        {
          Numtitle: "03",
          stepWays: 1,
          title: "添加学生账号",
          desc: "学生账号由管理统一管理，学生账号可用于登录进名校学生端",
          steps: "添加学生账号步骤:",
          details:
            "1.点击底部【工作台】 - 2.点击【成员管理】 - 3.点击下方新建学生账号、注册完成后学生端可登陆此账号",
          imgUrl: require("@/assets/userGuide/step3.png"),
        },
        {
          Numtitle: "04",
          stepWays: 2,
          title: ["创建班级", "分配成员"],
          desc: [
            "创建好班级后添加成员到班级，将之前添加的账号拉到创建的班级里",
            "",
          ],
          steps: ["创建班级步骤:", "分配成员步骤:"],
          details: [
            "1.点击底部【工作台】 - 2.点击【班级管理】 - 3.点击下方【新建班级】填写完成后将会出现班级列表，教师端创建的班级也显示在机构端班级列表里",
            "1.创建好班级后，点击进入班级 - 2.点击【添加成员】分配进班的成员账号",
          ],
          imgUrl: [
            require("@/assets/userGuide/step4_01.png"),
            require("@/assets/userGuide/step4_02.png"),
          ],
        },
        {
          Numtitle: "05",
          stepWays: 2,
          title: ["兑换练习册", "分配目录"],
          desc: [
            "兑换的练习册默认在未分配目录下，教师端还未可见",
            "需要根据您的要求自定义目录，将为分配的练习册分配至目录，教师端才会可见",
          ],
          steps: ["兑换练习册步骤:", "分配目录步骤："],
          details: [
            "1.点击底部【工作台】 - 2.点击【练习册商场】 - 3.筛选练习册 - 4.进入【购物车】、确定需要兑换的练习册、完成兑换",
            "1.点击底部【工作台】 - 2.点击【我的练习册】 - 3.点击未分类(可先创建目录分类) - 4.选择需要分类的练习 - 5.(可新建的自定义目录）选择需要移动到的目录 - 6.点击【移动】完成分配",
          ],
          imgUrl: [
            require("@/assets/userGuide/step5_01.png"),
            require("@/assets/userGuide/step5_02.png"),
            require("@/assets/userGuide/step5_03.jpg"),
          ],
        },
        {
          Numtitle: "06",
          stepWays: 1,
          title: "教师端布置作业",
          desc:
            "教师端布置下载进名校教师端，登录管理端创建的教师账号，布置作业给学生学生在学生端会接收到作业，作业截止时间后，教师端会收到学生端传来的作业报告",
          steps: "作业步骤:",
          details:
            "1.点击底部【首页】 - 2.点击【布置作业】 - 3.填写【作业名称】【选择试卷】【选择班级】【选择做题时间】等信息即可发布给学生端",
          imgUrl: require("@/assets/userGuide/step6.jpg"),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.user-guide {
  cursor: pointer;
}
</style>
