import request from "@/utils/request";

// 获取错题列表
export function getWrongbook(params) {
  return request({
    url: "/api/teacher/WrongBook/List",
    method: "GET",
    params
  });
}
// 错题详情
export function getWrongDetail(params) {
  return request({
    url: "/api/teacher/WrongBook/Details",
    method: "GET",
    params
  });
}
