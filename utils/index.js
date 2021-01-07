var crypto = require('crypto');

/**
 * 获取指定格式的时间
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 时间戳转为几分钟前
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 字符串转字节数
 * @param {string} input value
 * @returns {number} output value
 */
function byteLength (str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns {Array}
 */
function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

/**
 * 数字变为三位逗号分割
 * @param {*} num 需要分割的数字
 */
function numToFormat (num) {
  num = typeof num !== 'undefined' ? num + '' : ''
  let reg = /(?!^)(?=(\d{3})+$)/g
  return num.replace(reg, ',')
}

/**
 * 验证身份证是否合法
 * @param {*} code codeId
 */
function IdentityCodeValid (code) {
  var city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
  // var tip = ''
  var pass = true
  if (!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
    // tip = '身份证号格式错误'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    // tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      code[17] = code[17].toUpperCase()
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      // var last = parity[sum % 11]
      if (parity[sum % 11] != code[17]) {
        // tip = '校验位错误'
        pass = false
      }
    }
  }
  return pass
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP (req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

/**
* 处理使用async/await时处理报错的方法
*/
function handleError (promise) {
  if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
    return new Promise((resolve, reject) => {
      reject(new Error("requires promises as the param"));
    }).catch((err) => {
      return [err, null];
    });
  }
  return promise.then(function () {
    console.log(arguments, 'arguments')
    return [null, ...arguments];
  }).catch(err => {
    return [err, null];
  });
}

function md5 (content) {
  var md5 = crypto.createHash('md5');
  md5.update(content);
  return md5.digest('hex');
}

function toBase64 (content) {
  return new Buffer(content).toString('base64');
}

function fromBase64 (content) {
  return new Buffer(content, 'base64').toString();
}

module.exports = {
  parseTime,
  formatTime,
  byteLength,
  uniqueArr,
  numToFormat,
  IdentityCodeValid,
  getClientIP,
  handleError,
  md5,
  toBase64,
  fromBase64
}
