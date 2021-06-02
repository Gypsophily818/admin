import request from "@/utils/request";

//  获取发布作业
export function getDeploymentPublish() {
  return request({
    url: "/api/teacher/Deploy/Publish",
    method: "GET"
  });
}
// 布置作业提交
export const POSTdeployPublish = params => {
  return request({
    url: "/api/teacher/Deploy/Publish",
    method: "POST",
    data: params
  });
};
//  获取班级列表
export function getClassroomList() {
  return request({
    url: "/api/teacher/Deploy/ClassroomList",
    method: "GET"
  });
}
// 按班级查询学生列表
export function getClassroomStuList(params) {
  return request({
    url: "/api/teacher/Deploy/ClassroomStudentList",
    method: "GET",
    params
  });
}
//  创建班级
export function POSTsetClass(params) {
  return request({
    url: "/api/teacher/Class/Create",
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    // application/problem+json; charset=utf-8
    data: params
  });
}
