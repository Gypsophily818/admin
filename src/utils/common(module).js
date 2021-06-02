import Cookies from "js-cookie";
import marked from "marked";

module.exports = {
  // 获取token
  getToken: () => Cookies.get("accessToken"),

  // 记住我 七天有效期
  rememberMe: val => Cookies.set("rememberMe", val, { expires: 7 }),
  // 获取密码
  getrememberMe: () => Cookies.getJSON("rememberMe"),
  // 销毁密码
  destoryRememberMe: () => Cookies.remove("rememberMe"),

  // 暂存登录信息
  setuserInfo: val => localStorage.setItem("userInfo", JSON.stringify(val)),
  // 获取登录信息
  getuserInfo: () => JSON.parse(localStorage.getItem("userInfo")),
  // 销毁登录信息
  destroyUserInfo: () => localStorage.removeItem("userInfo"),

  // 格式化数字百分比
  parseRate: val => {
    val = (val * 100).toPrecision(4);
    let old = val.toString();
    let newstr = old;
    //循环变量 小数部分长度
    var leng = old.length - old.indexOf(".") - 1;
    //判断是否有效数
    if (old.indexOf(".") > -1) {
      //循环小数部分
      for (let i = leng; i > 0; i--) {
        //如果newstr末尾有0
        if (
          newstr.lastIndexOf("0") > -1 &&
          newstr.substr(newstr.length - 1, 1) == 0
        ) {
          var k = newstr.lastIndexOf("0");
          //如果小数点后只有一个0 去掉小数点
          if (newstr.charAt(k - 1) == ".") {
            return newstr.substring(0, k - 1) + "%";
          } else {
            //否则 去掉一个0
            newstr = newstr.substring(0, k);
          }
        } else {
          //如果末尾没有0
          return newstr + "%";
        }
      }
    }
    return val + "%";
  }
};
