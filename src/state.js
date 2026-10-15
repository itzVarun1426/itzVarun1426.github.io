export const state = {
  scrollY: 0,
  progress: 0,
  launchT: -1,
  clutter: 1,
  mouseX: 0,
  mouseY: 0,
};

if (typeof window !== 'undefined') {
  window.__portfolioState = state;
}
