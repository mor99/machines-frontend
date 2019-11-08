import ImageViwer from 'viewerjs';

export function formatRouters(items) {
  function getKeys(items = []) {
    items.forEach(z => {
      const keys = z.path.replace(/\//,'').replace(/\/:\w+/g, '').split("/");
      z['key'] = keys[keys.length - 1];
      if (z.children && z.children.length) {
        getKeys(z.children);
      }
    });
  }
  getKeys(items);
  return items;
}
export function filterMenuFromPowerList(items = [],powerList,) {
  // return items;
  return items.filter((z,) => {
    const find = powerList.find(j => j.key === z.key);
    if (find) {
      z.children = filterMenuFromPowerList(z.children,powerList);
      z.actions = find.actions || [];
      return true;
    }
    return false;
  });
}

export function formatValue(val) {
  return val || '--';
}
export function formatTimeVal(time, fromat = 'YYYY-MM-DD') {
  return time !== undefined && moment(time).isValid() ? moment(time).format(fromat) : '--';
}
/**
 * 图片预览
 * @param box
 * @param option
 * @constructor
 */
export function InitImageViwer(box = 'common-img-list', option  = {}) {
  setTimeout(() => {
    const el = document.getElementById(box) || document.querySelectorAll(`.${box}`);
    if (el.length) {
      el.forEach(z => {
        new ImageViwer(z,option);
      })
    }
  },1000);
}
/**
 * 检查数组
 * @param data
 * @returns {boolean}
 */
export function isArray(data) {
  return Object.prototype.toString.call(data) === "[object Array]";
}

/**
 * 判读数字
 * @param data
 * @returns {boolean}
 */
export function isNumber(data) {
  return Object.prototype.toString.call(data) === "[object Number]";
}
/**
 * 检查对象
 * @param data
 * @returns {boolean}
 */
export function isObject(data) {
  return Object.prototype.toString.call(data) === "[object Object]";
}
/**
 * 检查字符串
 * @param data
 * @returns {boolean}
 */
export function isString(data) {
  return Object.prototype.toString.call(data) === "[object String]";
}
/**
 * 检查函数
 * @param data
 * @returns {boolean}
 */
export function isFunction(data) {
  return Object.prototype.toString.call(data) === "[object Function]";
}
/**
 * 是否是class组件
 * @param data
 * @returns {boolean}
 */
export function isReactComponent(data) {
  try {
    return !!data.prototype.isReactComponent;
  } catch (e){
    return false;
  }
}
