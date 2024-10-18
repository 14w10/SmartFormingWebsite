import Router from 'next/router';

const sleep = (ms = 0) => new Promise(res => setTimeout(res, ms));

export const goToContactForm = async () => {
  const scrollToForm = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  if (window.location.pathname !== '/') {
    await Router.push('/');
    await sleep(100);
    scrollToForm();
  } else {
    scrollToForm();
  }
};
