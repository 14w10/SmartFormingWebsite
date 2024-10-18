// https://www.30secondsofcode.org/js/s/merge
export const merge = <T = Record<string, any>>(...objs: Record<string, any>[]) =>
  [...objs].reduce(
    (acc, obj = {}) =>
      Object.keys(obj).reduce((a, k) => {
        acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k];
        return acc;
      }, {}),
    {},
  ) as T;
