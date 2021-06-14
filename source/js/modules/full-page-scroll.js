import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.fillPage = document.querySelector('.fill-screen');

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);

    this.screens = [
      {
        next: () => {
          this.changePageDisplay();
        },
      },
      {
        prev: () => {
          this.changePageDisplay();
        },
        next: () => {
          const onTransitionEnd = () => {
            this.fillPage.removeEventListener('transitionend', onTransitionEnd);
            this.fillPage.classList.remove('fill-screen--active');
            this.changeVisibilityDisplay();
            this.emitChangeDisplayEvent();
          };
          this.fillPage.addEventListener('transitionend', onTransitionEnd);
          this.fillPage.classList.add('fill-screen--active');
          this.changeActiveMenuItem();
        },
      },
      {
        prev: () => {
          this.changePageDisplay();
        },
        next: () => {
          this.changePageDisplay();
        },
      },
      {
        prev: () => {
          this.changePageDisplay();
        },
        next: () => {
          this.changePageDisplay();
        },
      },
      {
        prev: () => {
          this.changePageDisplay();
        },
      }
    ];
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    this.updateScreen(evt.deltaY);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    window.setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, '100');
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }


  updateScreen(delta) {
    if (delta > 0) {
      this.nextScreen();
    } else {
      this.prevScreen();
    }
  }

  nextScreen() {
    if (this.screens[this.activeScreen].next) {
      this.screens[this.activeScreen++].next();
    }
  }

  prevScreen() {
    if (this.screens[this.activeScreen].prev) {
      this.screens[this.activeScreen--].prev();
    }
  }

}
