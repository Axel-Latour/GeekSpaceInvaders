//Global reference to the player ship
var ship;
var aliens;

const LINES_OF_ALIEN = 3;
const ALIENS_PER_LINE = 5;

/**
 * Initialize the game by placing all the Sprites
 */
function initGame() {
  document.addEventListener("keydown", onKeyDown);
  generateShip();
  generateAliens();
}

/**
 * Generate the ship Sprite and place it in the middle of the bottom of the window
 */
function generateShip() {
  ship = new Ship("ship", 0, 0);
  // ship.left = (document.body.clientWidth - Sprite.SPRITE_SIZE) / 2;
  ship.top = document.body.clientHeight - Sprite.SPRITE_SIZE;
}

/**
 * Generate all the aliensthat must be displayed on the screen.
 * Launch the initial animation on each of the aliens
 */
function generateAliens() {
  aliens = [];
  let currentAlien;
  for (var i = 0; i < LINES_OF_ALIEN; i++) {
    aliens[i] = [];
    for (var j = 0; j < ALIENS_PER_LINE; j++) {
      currentAlien = new Alien(
        `alien_${i + 1}`,
        j * Alien.SPACE_BETWEEN_ALIEN,
        i * Alien.SPACE_BETWEEN_ALIEN
      );
      aliens[i][j] = currentAlien;
      animateSprite(currentAlien, true);
    }
  }
}

/**
 * Launch an animation on a given Sprite, to make it move to the left or to thr right
 * If one of the alien can't make a move, beause it exists of the screen
 * (moveRight/moveLeft returns false in this case), the animation is reversed.
 * @param {*} sprite sprite to animate
 * @param {*} animateToRight true if the animation should move the sprite to the right.
 * Otherwise, it will make the sprite move to the left
 */
function animateSprite(sprite, animateToRight) {
  sprite.startAnimation(Alien.MOVE_INTERVAL, () => {
    if (animateToRight && !sprite.moveRight()) {
      oppositeAnimation(animateToRight);
    }
    if (!animateToRight && !sprite.moveLeft()) {
      oppositeAnimation(animateToRight);
    }
  });
}

/**
 * For each alien, move them to the next line and animate them
 * in the opposite direction of the current animation
 * @param {*} animateToRight true if the animation is currently moving to the right
 */
function oppositeAnimation(animateToRight) {
  for (var i = 0; i < LINES_OF_ALIEN; i++) {
    for (var j = 0; j < ALIENS_PER_LINE; j++) {
      aliens[i][j].top += Alien.SPACE_BETWEEN_ALIEN;
      animateSprite(aliens[i][j], !animateToRight);
    }
  }
}

/**
 * Triggered when a key is pressed on th keyboard.
 * Handle the ship move with right and left arrow.
 * Launch missile when pressing space bar
 * @param {*} e keyboard event
 */
function onKeyDown(e) {
  switch (e.keyCode) {
    //Left arrow
    case 37:
      ship.moveLeft();
      break;
    //Right arrow
    case 39:
      ship.moveRight();
      break;
    //Space bar
    case 32:
      aliens[0][0]._node.src = "assets/alien_1_2.png";
      break;
    default:
      break;
  }
}
