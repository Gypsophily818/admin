import request from "@/utils/request";

/**
 *
 * @param {Number} pageSize  页幅
 * @param {Number} pageIndex 页码
 * @returns (pageSize , pageIndex )=>params
 */
// 获取报告
export function getReport(params) {
  return request({
    url: "/api/teacher/Report/Index",
    method: "GET",
    params
  });
}
// 作业报告详情
export function getReportDetail(params) {
  return request({
    url: "/api/teacher/Report/Detail",
    method: "GET",
    params
  });
}

