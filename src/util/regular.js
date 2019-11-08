export const loginAccount = /^[a-zA-Z0-9]+$/; //登录名
export const loginImgCode = /^[a-zA-Z0-9]{4}$/; // 图片验证码
export const common = /[a-zA-Z0-9]+$/; // 只支持字母数字字符
// export const allNumber = /^\d+([.]{1}[0-9]{1,2}?)$/; // 全局数量小数点后二位
export const allNumber = /^[0-9]+([.]{1}[0-9]{1,2})?$/; // 全局数量小数点后二位
export const floatNum = /^[0-9]+\.?[0-9]*$/; // 全局数量
export const phoneNumber = /^1\d{10}/; // 电话号码
export const telPhone = /^(\d{3,4}-)?(\d{6,8})$/; // 座机
export const chinese = /^[\u4E00-\u9FFF]{2,5}$/; // 中文姓名
export const blank = /^(?!(\s+$))/;// 不能全部为空格
export const bankNumber = /^([1-9]{1})(\d{14}|\d{18})$/; // 银行卡号
export const email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/; // 邮箱验证
export const IDNumber = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/; // 身份证号码校验

export const account = /^[a-zA-Z]{6,10}$/; // 英文6-10字符
export const password = /^\w{6,18}$/; // 英文6-18字符
export const chinese10 =/^[\u4E00-\u9FFF]{2,10}$/; // 中文2-10个字符
export const numberInt =/^\d{2,10}$/; // 数字2-10个字符

export const CommonInputRule =  {
  reg: /^[\s\S]{0,20}$/,
  message: "请输入20个字符以内",
};
