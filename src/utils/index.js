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
