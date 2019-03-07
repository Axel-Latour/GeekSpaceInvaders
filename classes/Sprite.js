class Sprite {
  constructor(imageFile, left, top) {
    this.imageFile = imageFile;
    this.generateDomElement();
    this.left = left;
    this.top = top;
  }

  generateDomElement() {
    this._node = document.createElement("img");
    this._node.src = `assets/${this.imageFile}.png`;
    this._node.style.position = "absolute";
    document.body.appendChild(this._node);
  }

  get left() {
    return this._left;
  }

  set left(value) {
    this._left = value;
    this._node.style.left = `${value}px`;
  }

  get top() {
    return this._top;
  }

  set top(value) {
    this._top = value;
    this._node.style.top = `${value}px`;
  }
}
