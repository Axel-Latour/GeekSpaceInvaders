class Missile extends Sprite {
  constructor(imageFile, left, top) {
    super(imageFile, left, top);
    this._node.style.display = "none";
  }

  /**
   * Move the Missile to the top, if it doesn't exit of the screen
   * @param {*} valueToAdd: number of top pixel to change
   * @returns true if the move is done, false if it can't be done
   */
  moveTop() {
    if (this.top > -SPRITE_SIZE) {
      this.top -= PIXEL_BY_MISSILE_MOVE;
      return true;
    }
    return false;
  }

  moveDown() {
    if (
      this.top + SPRITE_SIZE <
      document.getElementById(GAME_AREA_ID).clientHeight
    ) {
      this.top += PIXEL_BY_MISSILE_MOVE;
      return true;
    }
    return false;
  }

  /**
   * Hide the given missile and stop its animation.
   * It's used when the ship is launching a missile.
   */
  hideMissile() {
    this._node.style.display = "none";
    this.stopAnimation();
  }
}
