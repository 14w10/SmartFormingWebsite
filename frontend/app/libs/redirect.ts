import { NextPageContext } from 'next';
import Router from 'next/router';

export const redirect = async (ctx: NextPageContext | null, target: string, as?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('%c%s', `color: red; background: #D1D3D4; padding: 3px;`, 'redirect: ', target);
  }

  // TODO deal with Firefox history.replaceState bug https://bugzilla.mozilla.org/buglist.cgi?quicksearch=history.replaceState
  if (process.browser) {
    return Router.push(target, as || target);
  }

  if (ctx?.res) {
    ctx.res.writeHead(303, { Location: target });
    ctx.res.end();
  }
};
