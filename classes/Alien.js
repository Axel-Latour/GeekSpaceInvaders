class Alien extends Sprite {
  static PIXEL_BY_ALIEN_MOVE = 2;
  static MOVE_INTERVAL = 200;
  static SPACE_BETWEEN_ALIEN = 50;

  constructor(imageFile, left, top) {
    super(`${imageFile}_1`, left, top);
    this.initialImageFile = imageFile;
  }

  /**
   * Move the alien to the left and update its image on each move.
   * @returns true if the move is done, false if it can't be done
   */
  moveLeft() {
    this.updateImage();
    if (!super.moveLeft(Alien.PIXEL_BY_ALIEN_MOVE)) {
      return false;
    }
    return true;
  }

  /**
   * Move the alien to the right and update its image on each move.
   * @returns true if the move is done, false if it can't be done
   */
  moveRight() {
    this.updateImage();
    if (!super.moveRight(Alien.PIXEL_BY_ALIEN_MOVE)) {
      return false;
    }
    return true;
  }

  /**
   * Change the image associated to the alien, to make a sort of animation.
   * Each move will change the image, like if the alien was animated
   */
  updateImage() {
    if (this.fullImagePath === this.generateFullImagePath(this.imageFile)) {
      this._node.src = this.generateFullImagePath(`${this.initialImageFile}_2`);
    } else {
      this._node.src = this.generateFullImagePath(`${this.initialImageFile}_1`);
    }
  }
}
