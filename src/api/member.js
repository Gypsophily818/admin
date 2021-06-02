import request from "@/utils/request";

// 成员首页 --- API
//修改成员登陆密码
export function postChangeMemberPassword(data) {
  return request({
    url: `/api/teacher/Member/ChangeMemberPassword`,
    method: "POST",
    data
  });
}

// 修改成员头像
export function postChangeMemberAvatar(data) {
  return request({
    url: `/api/teacher/Member/ChangeMemberAvatar`,
    method: "POST",
    data
  });
}

// 修改成员手机号
export function postChangeMemberPhoneNumber(data) {
  return request({
    url: `/api/teacher/Member/ChangeMemberPhoneNumber`,
    method: "POST",
    data
  });
}
