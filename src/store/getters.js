const getters = {
  sidebar: state => state.app.sidebar,
  // language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  loginedUser: state => state.user.loginedUser,
  avatar: state => state.user.avatar,
  userName: state => state.user.userName,
  baseURL: state => state.user.baseURL,
  toDownloadID: state => state.user.toDownloadID,
  introduction: state => state.user.introduction,
  // permission_routes: state => state.permission.routes,
  routes: state => state.router.routes,
  errorLogs: state => state.errorLog.logs,
  gobalName: state => state.gobalname.gobalName,
  hasSelection: state => state.homework.hasSelection
};
export default getters;
