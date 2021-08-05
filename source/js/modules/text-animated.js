export default () => {
  class TextAnimated {
    constructor(el) {
      this.el = el;
      this.content = this.el.innerHTML;
    }

    init() {
      this.decorate();
    }

    decorate() {
      this.el.innerHTML = ``;
      const strings = this.content.split(` `);
      strings.forEach((string, index) => {
        if (index > 0) {
          const spaceSpan = document.createTextNode(` `);
          this.el.appendChild(spaceSpan);
        }
        const stringSpan = document.createElement(`SPAN`);
        stringSpan.classList.add(`text-animated__string`);
        [...string].forEach((char) => {
          const charSpan = document.createElement(`SPAN`);
          charSpan.classList.add(`text-animated__char`);
          charSpan.innerHTML = char;
          stringSpan.appendChild(charSpan);
        });
        this.el.appendChild(stringSpan);
      });
    }


  }

  const textsToAnimate = document.querySelectorAll(`.text-animated`);
  for (let textToAnimate of textsToAnimate) {
    new TextAnimated(textToAnimate).init();
  }
}