export const scrollToElement = (selector: string, hold = 0, smooth = true) => {
  const el: any = document.querySelector(`#${selector}`);

  if (el) {
    window.scroll({ top: el.offsetTop - hold, left: 0, behavior: smooth ? 'smooth' : 'auto' });
  }
};
