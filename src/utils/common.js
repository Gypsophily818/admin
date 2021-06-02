import Cookies from "js-cookie";
import marked from "marked";

// 获取token
export const getToken = () => Cookies.get("accessToken");

// 记住我 七天有效期
export const rememberMe = val => Cookies.set("rememberMe", val, { expires: 7 });
export const getrememberMe = () => Cookies.getJSON("rememberMe");
export const destoryRememberMe = () => Cookies.remove("rememberMe");

// 暂存登录信息
export const setuserInfo = val =>
  localStorage.setItem("userInfo", JSON.stringify(val));
// 获取登录信息
export const getuserInfo = () => JSON.parse(localStorage.getItem("userInfo"));
// 销毁登录信息
export const destroyUserInfo = () => localStorage.removeItem("userInfo");

// 格式化数字百分比
export const parseRate = val => {
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
};



// marked 配置
const rendererMD = new marked.Renderer();
marked.setOptions({
  renderer: rendererMD,
  gfm: true, //默认为true。 允许 Git Hub标准的markdown.
  tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
  breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
  pedantic: false, //默认为false。 尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。
  sanitize: false, //对输出进行过滤（清理）
  smartLists: true,
  smartypants: false //使用更为时髦的标点，比如在引用语法中加入破折号。
});
export const markedText = val => {
  return marked(val);
};
