const state = {
  hasSelection: [] //本地已选试卷
};

const mutations = {
  SET_SELECTION: (state, val) => {
    state.hasSelection = [...val];
    // localStorage.setItem("hasSelectPaperVuex", JSON.stringify(state.hasSelection));
  }
};

const actions = {
  addHasSelection({ commit }, val) {
    commit("SET_SELECTION", val);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
