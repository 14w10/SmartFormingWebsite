import { chain, map, toPairs, type } from 'ramda';

export const objectToCssCustomProps = (obj: Record<string, any>) => {
  const go = (obj_: any): [string, string][] =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    chain(([k, v]) => {
      if (type(v) === 'Object' || type(v) === 'Array') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return map(([k_, v_]) => [`${k}-${k_}`, v_], go(v));
      } else {
        return [[k, v]];
      }
    }, toPairs(obj_));

  const result = go(obj);

  return result.map(([key, val]) => `--${key}: ${val};`);
};

export const getScrollBarWidth = () => {
  const rect = document.body.getBoundingClientRect();
  const scrollbarWidth = window.innerWidth - rect.width;

  return scrollbarWidth;
};
