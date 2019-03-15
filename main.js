//Global reference to the player ship
var isGameInitialzed = false;
var totalNumberOfAliens = ALIENS_IMAGE_ORDER.length * ALIENS_PER_LINE;
var numberOfAliensKilled = 0;
var ship;
var aliens;
var missile;

function initFirstScreen() {
  document.addEventListener("keydown", onKeyDown);
}

/**
 * Initialize the game by placing all the Sprites
 */
function initGame() {
  document.getElementById(START_CONTAINER_ID).style.display = "none";
  document.getElementById(GAME_CONTAINER_ID).style.display = "flex";
  updateScoreValue();
  generateShip();
  generateAliens();
}

/**
 * Generate the ship Sprite and place it in the middle of the bottom of the window
 */
function generateShip() {
  ship = new Ship("ship", 0, 0);
  ship.left =
    (document.getElementById(GAME_AREA_ID).clientWidth - Sprite.SPRITE_SIZE) /
    2;
  ship.top =
    document.getElementById(GAME_AREA_ID).clientHeight - Sprite.SPRITE_SIZE;
}

/**
 * Generate all the aliensthat must be displayed on the screen.
 * Launch the initial animation on each of the aliens
 */
function generateAliens() {
  aliens = [];
  let currentAlien;
  for (var i = 0; i < ALIENS_IMAGE_ORDER.length; i++) {
    aliens[i] = [];
    for (var j = 0; j < ALIENS_PER_LINE; j++) {
      currentAlien = new Alien(
        `alien_${ALIENS_IMAGE_ORDER[i]}`,
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
      reverseAnimation(animateToRight);
    }
    if (!animateToRight && !sprite.moveLeft()) {
      reverseAnimation(animateToRight);
    }
  });
}

/**
 * For each displayed alien, move them to the next line and animate them
 * in the opposite direction of the current animation
 * @param {*} animateToRight true if the animation is currently moving to the right
 */
function reverseAnimation(animateToRight) {
  aliens.forEach(lineOfAliens =>
    lineOfAliens.forEach(alien => {
      if (alien._node.style.display !== "none") {
        alien.top += Alien.SPACE_BETWEEN_ALIEN;
        animateSprite(alien, !animateToRight);
        checkIfAlienIsOnTheShip(alien);
      }
    })
  );
}

/**
 * If no missile has already been generated, generate it hided.
 * Placce it just on the top of the ship and animate it to go until
 * the top of screen. Once the missile is out of the screen, hide it.
 * We can display only one missile at a time.
 */
function launchMissile() {
  if (!missile) {
    missile = new Missile("ship_missile", 0, 0);
    missile._node.style.display = "none";
  }
  if (missile._node.style.display === "none") {
    missile._node.style.display = "block";
    missile.top = ship.top - Sprite.SPRITE_SIZE;
    missile.left = ship.left + Sprite.SPRITE_SIZE / 2 - SHIP_MISSILE_WIDTH / 2;
    missile.startAnimation(Missile.MOVE_INTERVAL, () => {
      if (!missile.moveTop()) {
        missile._node.style.display = "none";
      } else {
        checkIfAlienIsTouched();
      }
    });
  }
}

/**
 * Loop over all the displayed aliens to check if they're colliding
 * with the ship missile
 */
function checkIfAlienIsTouched() {
  aliens.forEach(lineOfAliens =>
    lineOfAliens.forEach(alien => {
      if (alien._node.style.display !== "none") {
        if (missile.checkCollision(alien)) {
          alien._node.style.display = "none";
          alien.stopAnimation();
          missile._node.style.display = "none";
          missile.stopAnimation();
          numberOfAliensKilled++;
          updateScoreValue();
          checkForVictory();
        }
      }
    })
  );
}

/**
 * Check if the given alien is on the same line than the ship.
 * If it is, it means that the game is lost.
 * @param {*} alien alien to check
 */
function checkIfAlienIsOnTheShip(alien) {
  if (alien.top + Sprite.SPRITE_SIZE > ship.top) {
    stopTheGameWithDefeat();
  }
}

/**
 * Update the score value in the template when an alien is killed
 */
function updateScoreValue() {
  document.getElementById(
    SCORE_VALUE_ID
  ).innerHTML = `${numberOfAliensKilled} / ${totalNumberOfAliens}`;
}

/**
 * Check if the number of killed aliens is equal to the total number
 * of aliens in the game. If it is, the game is won,
 * it displays the victory message and hides the game area
 */
function checkForVictory() {
  if (numberOfAliensKilled === totalNumberOfAliens) {
    document.getElementById(VICTORY_CONTAINER_ID).style.display = "flex";
    stopTheGame();
  }
}

/**
 * Display the defeat message and stop the game by hiding the game area
 */
function stopTheGameWithDefeat() {
  document.getElementById(DEFEAT_CONTAINER_ID).style.display = "flex";
  stopTheGame();
}

/**
 * When the game is over, hide the game container and stop all the alien animations
 */
function stopTheGame() {
  document.getElementById(GAME_CONTAINER_ID).style.display = "none";
  stopAliensAnimation();
}

/**
 * Stop the animation of every aliens
 */
function stopAliensAnimation() {
  aliens.forEach(lineOfAliens =>
    lineOfAliens.forEach(alien => alien.stopAnimation())
  );
}

/**
 * Triggered when a key is pressed on th keyboard.
 * Handle the ship move with right and left arrow.
 * Launch missile when pressing space bar
 * @param {*} e keyboard event
 */
function onKeyDown(e) {
  switch (e.keyCode) {
    //Enter key
    case 13:
      if (!isGameInitialzed) {
        isGameInitialzed = true;
        initGame();
      }
      break;
    //Space bar
    case 32:
      launchMissile();
      break;
    //Left arrow
    case 37:
      ship.moveLeft();
      break;
    //Right arrow
    case 39:
      ship.moveRight();
      break;
    default:
      break;
  }
}
