export const triggerResizeWindow = () => {
  window.dispatchEvent(new Event("resize"));
};
