import request from "@/utils/request";

/**
 *
 * @param {string} keyword
 * @param {Number} dateType 类型
 * @param {Number} pageSize  页幅
 * @param {Number} pageIndex 页码
 * @returns (keyword,dateType,pageSize,pageIndex )=>params
 */
//  获取布置作业记录
export function getDeploymentRecord(params) {
  return request({
    url: "/api/teacher/Deploy/DeploymentRecord",
    method: "GET",
    params
  });
}

// 获取布置作业记录详情
export function getRecordDetails(params) {
  return request({
    url: "/api/teacher/Deploy/RecordDetails",
    method: "GET",
    params
  });
}

// 布置作业记录 试卷详情
export function getPaperRecordDetails(params) {
  return request({
    url: "/api/teacher/TestPaper/List",
    method: "GET",
    params
  });
}

// 获取作业的错题列表(作业)
export function getWrongQuestionList(params) {
  return request({
    url: "/api/teacher/Deploy/WrongQuestionList",
    method: "GET",
    params
  });
}

// 作业的错题详情
export function getWrongQuestionDetails(params) {
  return request({
    url: "/api/teacher/Deploy/WrongQuestionDetails",
    method: "GET",
    params
  });
}

// 获取作业记录内试卷详情
export function getPaperDetails(params) {
  return request({
    url: "/api/teacher/TestPaper/Index",
    method: "GET",
    params
  });
}

// 获取学生作业详情
export function getStuRecordDetails(params) {
  return request({
    url: "/api/student/Work/Detail",
    method: "GET",
    params
  });
}

// 学生错题记录列表
export function getStudentTestPaperList(params) {
  return request({
    url: "/api/teacher/TestPaper/TestPaperListWithStudent",
    method: "GET",
    params
  });
}

//  学生作业的试卷详情 (错题查看详情)
export function getStuTestPaperListDetail(params) {
  return request({
    url: "/api/teacher/TestPaper/TestPaperDetailWithStudent",
    method: "GET",
    params
  });
}
