import request from "@/utils/request";

// 新建班级
export function postCreateClass(params) {
  return request({
    url: "/api/teacher/Class/Create",
    method: "POST",
    data: params
  });
}

// 新版班级首页
export function getClassIndex(params) {
  return request({
    url: "/api/teacher/Class/Index",
    method: "GET",
    params
  });
}

// 班级列表
export function getClassroomList(params) {
  return request({
    url: "/api/teacher/Class/ClassroomList",
    method: "GET",
    params
  });
}

// 班级信息
export function getClassInfo(params) {
  return request({
    url: "/api/teacher/Class/ClassInfo",
    method: "GET",
    params
  });
}

// 班级成员列表
export function getMemberList(params) {
  return request({
    url: "/api/teacher/Class/MemberList",
    method: "GET",
    params
  });
}

// 待审核成员列表
export function getPendingJoinList(params) {
  return request({
    url: `/api/teacher/Class/PendingJoinList`,
    method: "GET",
    params
  });
}

// 审核成员加入
export function putVerifyJoin(data) {
  return request({
    url: `/api/teacher/Class/VerifyJoin`,
    method: "PUT",
    data
  });
}


// 创建新学生到班级
export function postCreateStudent(params) {
  return request({
    url: "/api/teacher/Class/CreateStudentToClass",
    method: "POST",
    data: params
  });
}

// 更改班级名称
export function putUpdateClassName(classId, className) {
  return request({
    url: `/api/teacher/Class/UpdateClassName?classId=${classId}&className=${className}`,
    method: "PUT"
  });
}

// 更改成员名称
export function putUpdateMemberName(classId, memberUserId, memberName) {
  return request({
    url: `/api/teacher/Class/UpdateMemberName?classId=${classId}&memberUserId=${memberUserId}&memberName=${memberName}`,
    method: "PUT"
  });
}

// 转移成员到新班级:从原班级删除转移到新班级
export function putMoveToNewClass(data) {
  return request({
    url: `/api/teacher/Class/MoveToNewClass`,
    method: "PUT",
    data
  });
}

// 复制成员到新班级 原班级用户不删除复制到新班级 原班级和目标班级相同时代表从机构添加
export function putCopyToNewClass(data) {
  return request({
    url: `/api/teacher/Class/CopyToNewClass`,
    method: "PUT",
    data
  });
}

// 移除成员
export function DELETEmember(data) {
  return request({
    url: `/api/teacher/Class/RemoveMember`,
    method: "DELETE",
    data
  });
}

// 解散班级
export function DELETEclass(data) {
  return request({
    url: `/api/teacher/Class/Disband`,
    method: "DELETE",
    data
  });
}

// 退出本班
export function quitCurrentClass(data) {
  return request({
    url: `/api/teacher/Class/Quit`,
    method: "DELETE",
    data
  });
}

// 转让班主任
export function putTransferClassTeacher(data) {
  return request({
    url: `/api/teacher/Class/TransferOfClassTeacher`,
    method: "PUT",
    data
  });
}

// 本机构成员列表
export function getTeamOfMemberList(params) {
  return request({
    url: `/api/teacher/Class/ThisTeamOfMemberList`,
    method: "GET",
    params
  });
}
