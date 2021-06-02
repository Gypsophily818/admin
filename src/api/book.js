import request from "@/utils/request";

//  获取练习册列表
export function getProductBookList(params) {
  return request({
    url: "/api/Product/BookList",
    method: "GET",
    params
  });
}
// 获取练习册详情
export function getProductBookItem(params) {
  return request({
    url: "/api/Product/BookDetail",
    method: "GET",
    params
  });
}
// 获取练习册内试卷详情
export function getProductPaperDetail(params) {
  return request({
    url: "/api/Product/TestPaperDetail",
    method: "GET",
    params
  });
}
