class Ship extends Sprite {
  static PIXEL_BY_SHIP_MOVE = 10;

  constructor(imageFile, left, top) {
    super(imageFile, left, top);
  }

  moveLeft() {
    return super.moveLeft(Ship.PIXEL_BY_SHIP_MOVE);
  }

  moveRight() {
    return super.moveRight(Ship.PIXEL_BY_SHIP_MOVE);
  }
}
