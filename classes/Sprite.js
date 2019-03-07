class Sprite {
  constructor(imageFile, left, top) {
    this.imageFile = imageFile;
    this.left = left;
    this.top = top;
    this.generateDomElement();
  }

  generateDomElement() {
    this.node = document.createElement("img");
    this.node.src = this.imageFile;
    this.node.style.position = "absolute";
    this.node.style.left = this.left;
    this.node.style.top = this.top;
  }

  get left() {
    return this.left;
  }

  set left(value) {
    this.left = value;
    this.node.style.left = this.left;
  }

  get top() {
    return this.top;
  }

  set top(value) {
    this.top = value;
    this.node.style.top = this.top;
  }
}
