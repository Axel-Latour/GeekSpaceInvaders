class Missile extends Sprite {
  static PIXEL_BY_MISSILE_MOVE = 2;
  static MOVE_INTERVAL = 2;

  constructor(imageFile, left, top) {
    super(imageFile, left, top);
  }

  /**
   * Move the Missile to the top, if it doesn't exit of the screen
   * @param {*} valueToAdd: number of top pixel to change
   * @returns true if the move is done, false if it can't be done
   */
  moveTop() {
    if (this.top > -Sprite.SPRITE_SIZE) {
      this.top -= Missile.PIXEL_BY_MISSILE_MOVE;
      return true;
    }
    return false;
  }

  moveDown() {
    if (
      this.top + Sprite.SPRITE_SIZE <
      document.getElementById(GAME_AREA_ID).clientHeight
    ) {
      this.top += Missile.PIXEL_BY_MISSILE_MOVE;
      return true;
    }
    return false;
  }
}
