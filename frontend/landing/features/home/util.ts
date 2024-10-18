export const scrollToScreen = (screen = 2) => {
  window.scrollTo({
    top: document.documentElement.offsetWidth * (screen - 1),
    behavior: 'smooth',
  });
};
