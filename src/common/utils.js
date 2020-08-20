class Utils {
  static isString(param) {
    return (typeof param === 'string');
  }

  static isObject(param) {
    return (param != null && param.constructor.name === 'Object');
  }


}

module.exports = Utils;
