export default () => {
  let currentActiveSlideIndex = 0;
  const modifiers = {
    0: `body--ui-mod-1`,
    2: `body--ui-mod-2`,
    4: `body--ui-mod-3`,
  };

  window.addEventListener(`load`, () => {
    document.body.classList.add(`body--loaded`);
  });

  document.querySelector(`.js-slider`).addEventListener(`slideChanged`, (event) => {
    currentActiveSlideIndex = event.detail.activeIndex;
    updateUIModifiers();
  });

  document.body.addEventListener(`screenChanged`, (event) => {
    if (event.detail.screenName === `story`) {
      updateUIModifiers();
    } else {
      removeUIModifiers();
    }
  });

  const updateUIModifiers = () => {
    removeUIModifiers();
    document.body.classList.add(modifiers[currentActiveSlideIndex]);
  };

  const removeUIModifiers = () => {
    Object.keys(modifiers).forEach((key) => {
      document.body.classList.remove(modifiers[key]);
    });
  };

};
