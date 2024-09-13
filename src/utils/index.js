import parse from 'html-react-parser';
export function debounce(func, delay = 0) {
  let timer;

  return function (...args) {
    const context = this;

    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export function copyText(text, callback = () => {}) {
  const createTextArea = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      callback();
    } catch (err) {
      callback(err);
    }
    document.body.removeChild(textarea);
  };
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .catch(() => {
        createTextArea();
      })
      .then(() => {
        callback();
      });
  } else {
    createTextArea();
  }
}

export const calValueType = (value, type) => {
  const typeString = Object.prototype.toString.call(value);
  const typeMap = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regexp",
    "[object Function]": "function",
  };
  if (!!type) {
    return typeMap[typeString] === type;
  }
  return typeMap[typeString] || "unknown";
};

export function camelToSnakeCase(str) {
  return str
    // 匹配大写字母并将其转换为下划线后跟大写字母转小写
    .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
    // 移除字符串开头可能存在的下划线（如果有的话）
    .replace(/^_/, '');
}

export const parseWbText = (str) => {
  if (!str) {
    return ''
  }
  const newStr = str.replace(/<a\s+([^>]*)>(.*?)<\/a>/gi, function(match, attrs, innerHTML) {
    let updatedAttrs = attrs + ' target="_blank"';
    if (innerHTML === '全文') {
      updatedAttrs = updatedAttrs.replace(
        /\/status\/(\d+)/,
        'https://m.weibo.cn/detail/$1'
      );
    }
    return `<a ${updatedAttrs}>${innerHTML}</a>`;
  });
  return parse(newStr)
}

export function cloneDeep(value) {
  // 检查是否是 null 或者 undefined
  if (value === null || value === undefined) {
    return value;
  }

  // 检查是否是原始类型（字符串、数字、布尔值等）
  if (typeof value !== 'object') {
    return value;
  }

  // 检查是否是日期对象
  if (value instanceof Date) {
    return new Date(value);
  }

  // 检查是否是正则表达式对象
  if (value instanceof RegExp) {
    return new RegExp(value);
  }

  // 检查是否是数组
  if (Array.isArray(value)) {
    const cloneArr = [];
    for (let i = 0; i < value.length; i++) {
      cloneArr[i] = cloneDeep(value[i]);
    }
    return cloneArr;
  }

  // 检查是否是普通对象
  const cloneObj = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      cloneObj[key] = cloneDeep(value[key]);
    }
  }

  return cloneObj;
}