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
  navigator.clipboard
    .writeText(text)
    .catch(() => {
      var input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = 0;
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    })
    .finally(() => {
      callback();
    });
}

export const calValueType = (value, type) => {
  const typeString = Object.prototype.toString.call(value);
  const typeMap = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regexp',
    '[object Function]': 'function',
  };
  if (!!type) {
    return typeMap[typeString] === type;
  }
  return typeMap[typeString] || 'unknown';
}