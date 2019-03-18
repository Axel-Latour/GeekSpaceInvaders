class Sprite {
  static SPRITE_SIZE = 34;

  constructor(imageFile, left, top) {
    this.imageFile = imageFile;
    this.generateDomElement();
    this.left = left;
    this.top = top;
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

  getWidth() {
    return this._node.clientWidth;
  }

  getHeight() {
    return this._node.clientHeight;
  }

  /**
   * Check if a Sprite is displayed on the screen
   */
  isDisplayed() {
    return this._node.style.display !== "none";
  }

  /**
   * Generate the Sprite as an img HTML tag and add it to the body
   */
  generateDomElement() {
    this._node = document.createElement("img");
    this._node.src = this.generateFullImagePath(this.imageFile);
    this._node.style.position = "absolute";
    document.getElementById(GAME_AREA_ID).appendChild(this._node);
  }

  /**
   * Generate the full image path from the name of the image file.
   * @param {*} imageFile name of the image file
   */
  generateFullImagePath(imageFile) {
    this.fullImagePath = `assets/${imageFile}.png`;
    return this.fullImagePath;
  }

  /**
   * Move the current Sprite to the left, if it doesn't exit of the screen
   * @param {*} valueToAdd: number of left pixel to change
   * @returns true if the move is done, false if it can't be done
   */
  moveLeft(valueToAdd) {
    if (this.left - valueToAdd >= 0) {
      this.left -= valueToAdd;
      return true;
    }
    return false;
  }

  /**
   * Move the current Sprite to the right, if it doesn't exit of the screen
   * @param {*} valueToAdd: number of left pixel to change
   * @returns true if the move is done, false if it can't be done
   */
  moveRight(valueToAdd) {
    if (
      this.left + valueToAdd <
      document.body.clientWidth - Sprite.SPRITE_SIZE
    ) {
      this.left += valueToAdd;
      return true;
    }
    return false;
  }

  /**
   * Launch an animation using a timer with interval.
   * Firstly stop the existing animation.
   * @param {*} interval timer interval
   * @param {*} callback method that must be called for each interval
   */
  startAnimation(interval, callback) {
    this.stopAnimation();
    this._timer = setInterval(() => callback(), interval);
  }

  /**
   * Stop the animation of the Sprite if there's an existing one
   */
  stopAnimation() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  /**
   * Check if the current Sprite is in collision with the given Sprite.
   * It uses the top and left properties to define if the Sprites are in collision.
   * @param {*} other Sprite to check for collision
   * @returns true if there's a collision
   */
  checkCollision(other) {
    if (
      this.left + this._node.width > other.left &&
      this.left < other.left + Sprite.SPRITE_SIZE &&
      this.top + Sprite.SPRITE_SIZE > other.top &&
      this.top < other.top + Sprite.SPRITE_SIZE
    ) {
      return true;
    }
  }

  /**
   * Remove the current Sprite from the DOM and stop its animation
   */
  destroy() {
    this.stopAnimation();
    this._node.remove();
  }
}
