const state = {
  // ## 文字描述统一：（对于试卷）
  // ### 要求合格率  ===> *要求正确率*
  // ### 实际合格率或者实际达标率 ===> *正确率*
  // ### 达标状态（已达标/未达标）===> *通过状态：通过/未通过*
  // ### 通过率（对于一份作业来说）===>*正确率的平均值*
  // ### 错误率/平均错误率 ===*改成答错率*
  gobalName: {
    // 对于试卷
    Paper_RCorrect: "要求正确率",
    Paper_Correct: "正确率",
    Paper_Finish: "完成率",
    Paper_Pass: "通过",
    Paper_Fail: "未通过",
    // 对于作业
    Homework_Pass: "通过率",
    Homework_Finish: "平均完成率",
    Homework_Around: "平均回合数",
    Homework_AnswerF: "答错率"
  }
};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
