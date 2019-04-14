class Alien extends Sprite {
  constructor(imageFile, left, top) {
    super(`${imageFile}_1`, left, top);
    this.initialImageFile = imageFile;
    this.isMovingToTheRight = true;
  }

  get missile() {
    return this._missile;
  }

  set missile(missile) {
    this._missile = missile;
  }

  /**
   * Move the alien to the left and update its image on each move.
   * @returns true if the move is done, false if it can't be done
   */
  moveLeft() {
    this.updateImage();
    if (!super.moveLeft(PIXEL_BY_ALIEN_MOVE)) {
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
    if (!super.moveRight(PIXEL_BY_ALIEN_MOVE)) {
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

  /**
   * Generate an instance of missile associated to this alien.
   * It places the missile just in the middle, in front of the alien
   */
  launchMissile() {
    const missile = new Missile(MISSILE_IMG, 0, 0);
    missile._node.style.display = "block";
    missile.top = this.top + SPRITE_SIZE;
    missile.left = this.left + SPRITE_SIZE / 2 - MISSILE_WIDTH / 2;
    this.missile = missile;
  }

  destroyMissile() {
    this.missile.destroy();
    this.missile = null;
  }

  /**
   * Simulate the alien explosion.
   * Stop its move animation, change its image to an exploded alien,
   * and after an interval of time, hide it from the game area
   */
  explode() {
    this.stopAnimation();
    this._node.src = this.generateFullImagePath(EXPLODED_ALIEN_IMG);
    setTimeout(() => {
      this.destroy();
    }, ALIEN_MOVE_INTERVAL * 3);
  }
}
