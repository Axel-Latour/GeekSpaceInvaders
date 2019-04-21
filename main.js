//TODO : gérer un tableau de missile pour éviter de le faire disparaitre quand l'alien meurt ?

var isGameInitialzed = false;

var totalNumberOfAliens = ALIENS_IMAGE_ORDER.length * ALIENS_PER_LINE;
var numberOfAliensKilled = 0;
var numberOfLives = INITIAL_NUMBER_OF_LIVES;

var backgroundSound = new Audio("assets/sounds/background-sound.mp3");
var missileSound = new Audio("assets/sounds/shoot.wav");
var alienKilledSound = new Audio("assets/sounds/alien-killed.wav");
var shipKilled = new Audio("assets/sounds/ship-killed.wav");
var victorySound = new Audio("assets/sounds/victory.mp3");
var defeatSound = new Audio("assets/sounds/defeat.mp3");
var endOfGameBackgroundSound = new Audio(
  "assets/sounds/end-game-background.mp3"
);

// true if the ship is exploding. It bocks the keydown event.
var shipIsExploding = false;

var ship;
var aliens;
var missile;

var alienAnimationTimer;
var missileAnimationTimer;

/**
 * When the firt screen is loaded, add the event listener
 * on the keydown for all the game
 */
function initFirstScreen() {
  document.addEventListener("keydown", onKeyDown);
}

/**
 * Initialize the game by placing all the Sprites
 */
function initGame() {
  // Display the game area
  document.getElementById(START_CONTAINER_ID).style.display = "none";
  document.getElementById(GAME_CONTAINER_ID).style.display = "flex";
  // Generate global variable to calculate client width and height only once
  window.FULL_PAGE_WIDTH = document.body.clientWidth;
  window.FULL_PAGE_HEIGHT = document.body.clientHeight;
  window.GAME_AREA_WIDTH = document.getElementById(GAME_AREA_ID).clientWidth;
  window.GAME_AREA_HEIGHT = document.getElementById(GAME_AREA_ID).clientHeight;
  // Play infinite sound
  backgroundSound.loop = true;
  backgroundSound.play();
  // Display all necessary elements to start a party
  updateScoreValue();
  updateLivesValue();
  generateShip();
  generateAliens();
}

/**
 * Generate the ship Sprite and place it in the middle of the bottom of the window
 */
function generateShip() {
  shipIsExploding = false;
  ship = new Ship("ship", 0, 0);
  ship.left = (GAME_AREA_WIDTH - Sprite.SPRITE_SIZE) / 2;
  ship.top = GAME_AREA_HEIGHT - Sprite.SPRITE_SIZE;
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
        j * SPACE_BETWEEN_ALIEN,
        i * SPACE_BETWEEN_ALIEN
      );
      aliens[i][j] = currentAlien;
    }
  }
  animateEveryAliens();
  animateMissiles();
}

/**
 * Launch an animation on envery alien, to make them move to the left or to the right.
 * If one of the alien can't make a move, because it goes outside of the screen
 * (moveRight/moveLeft returns false in this case), the animation is reversed.
 **/
function animateEveryAliens() {
  alienAnimationTimer = setInterval(() => {
    aliens.forEach((lineOfAliens, alienLineIdx) =>
      lineOfAliens.forEach((alien, alienColumnIdx) => {
        if (alien) {
          randomlyShoot(alien, alienLineIdx, alienColumnIdx);
          if (alien.isMovingToTheRight && !alien.moveRight()) {
            reverseAnimation();
          } else if (!alien.isMovingToTheRight && !alien.moveLeft()) {
            reverseAnimation();
          }
        }
      })
    );
  }, ALIEN_MOVE_INTERVAL);
}

/**
 * For each displayed alien, move them to the next line and animate them
 * in the opposite direction of the current animation
 */
function reverseAnimation() {
  aliens.forEach(lineOfAliens =>
    lineOfAliens.forEach(alien => {
      if (alien) {
        alien.top += SPACE_BETWEEN_ALIEN;
        alien.isMovingToTheRight = !alien.isMovingToTheRight;
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
    missile = new Missile(MISSILE_IMG, 0, 0);
  }
  if (!missile.isDisplayed()) {
    missileSound.play();
    missile._node.style.display = "block";
    missile.top = ship.top - Sprite.SPRITE_SIZE;
    missile.left = ship.left + Sprite.SPRITE_SIZE / 2 - MISSILE_WIDTH / 2;
  }
}

/**
 * On each time interval, move the ship and the alien missiles
 */
function animateMissiles() {
  missileAnimationTimer = setInterval(() => {
    moveAliensMissile();
    moveShipMissile();
  }, MISSILE_MOVE_INTERVAL);
}

/**
 * If a ship missile is currently displayed on the screen,
 * make it move. If it's over the screen, hide it.
 * Otherwise, it checks if an alien is touched.
 */
function moveShipMissile() {
  if (missile && missile.isDisplayed()) {
    if (!missile.moveTop()) {
      missile.hideMissile();
    } else {
      checkIfAlienIsTouched();
    }
  }
}

/**
 * Check on every alien if they have a missile being launched.
 * If it is, try to make it move. If it's outside of the screen, destroy it.
 * Otherwise, check if it's in collision with another missile or with the ship
 */
function moveAliensMissile() {
  aliens.forEach(lineOfAliens =>
    lineOfAliens.forEach(alien => {
      if (alien && alien.missile) {
        if (!alien.missile.moveDown()) {
          alien.destroyMissile();
        } else {
          checkForMissileCollision(alien);
          checkIfShipIsTouched(alien);
        }
      }
    })
  );
}

/**
 * Calculate if the given alien is the last alien on its column.
 * If it is, it has a chance to launch a missile, based on the rate
 * @param {*} alien alien trying to launch a missile
 * @param {*} alienLine alien line position
 * @param {*} alienColumn alien column position
 */
function randomlyShoot(alien, alienLine, alienColumn) {
  if (alien && !alien.missile) {
    // Check if there's an invader under the given alien, only if the alien line is not the last one
    if (alienLine !== ALIENS_IMAGE_ORDER.length) {
      for (var i = alienLine + 1; i < ALIENS_IMAGE_ORDER.length; i++) {
        if (aliens[i][alienColumn]) {
          // Break the method, don't send any missile
          return;
        }
      }
    }
    if (Math.random() > ALIEN_SHOOT_RATE) {
      alien.launchMissile();
    }
  }
}

/**
 * Loop over all the displayed aliens to check if they're colliding
 * with the ship missile. If it is, hide the alien, the missile, update
 * the player score and check if the player won
 */
function checkIfAlienIsTouched() {
  aliens.forEach((lineOfAliens, currentLineIdx) =>
    lineOfAliens.forEach((alien, currentAlienIdx) => {
      if (alien && missile.checkCollision(alien)) {
        alienKilledSound.play();
        alien.explode();
        aliens[currentLineIdx][currentAlienIdx] = null;
        missile.hideMissile();
        numberOfAliensKilled++;
        updateScoreValue();
        checkForVictory();
      }
    })
  );
}

/**
 * Check if a given alien has launched a missile that
 * touched our ship. If it is, the ship is destroyed and the user
 * looses one life.
 * @param {*} alien: alien that shoots the missile
 */
function checkIfShipIsTouched(alien) {
  if (alien && alien.missile && alien.missile.checkCollision(ship)) {
    shipKilled.play();
    alien.destroyMissile();
    ship.explode();
    shipIsExploding = true;
    stopAliensAnimation();
    setTimeout(() => {
      explodeShip();
    }, 1000);
  }
}

/**
 * Check if the ship missile and the given alien missile
 * are in collision. If it is, destroy the two missiles.
 * @param {*} alien alien shooting the missile
 */
function checkForMissileCollision(alien) {
  if (
    missile &&
    missile.isDisplayed() &&
    alien &&
    alien.missile.checkCollision(missile)
  ) {
    alien.destroyMissile();
    missile.hideMissile();
  }
}

/**
 * Triggered when the ship is touched by an alien missile.
 * It destroys the ship to simulate its explosion and regenerate it.
 * It removes one life and check if the player has lost his game.
 * Finally, it restarts the alien animation
 */
function explodeShip() {
  ship.destroy();
  generateShip();
  numberOfLives--;
  updateLivesValue();
  if (numberOfLives === 0) {
    stopTheGameWithDefeat();
  } else {
    animateEveryAliens();
  }
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

function updateLivesValue() {
  document.getElementById(LIVES_VALUE_ID).innerHTML = numberOfLives;
}

/**
 * Check if the number of killed aliens is equal to the total number
 * of aliens in the game. If it is, the game is won,
 * it displays the victory message and hides the game area
 */
function checkForVictory() {
  if (numberOfAliensKilled === totalNumberOfAliens) {
    document.getElementById(
      VICTORY_CONTAINER_ID
    ).innerHTML = `CONGRATULATIONS ! YOU WIN THIS GAME ! THE CODE IS ${VICTORY_CODE}`;
    document.getElementById(VICTORY_CONTAINER_ID).style.display = "flex";
    stopTheGame();
    victorySound.play();
  }
}

/**
 * Display the defeat message and stop the game by hiding the game area
 */
function stopTheGameWithDefeat() {
  document.getElementById(DEFEAT_CONTAINER_ID).style.display = "flex";
  stopTheGame();
  defeatSound.play();
}

/**
 * When the game is over, hide the game container and stop all the alien animations
 */
function stopTheGame() {
  backgroundSound.pause();
  endOfGameBackgroundSound.loop = true;
  endOfGameBackgroundSound.play();
  document.getElementById(GAME_CONTAINER_ID).style.display = "none";
  stopAliensAnimation();
  if (missileAnimationTimer) {
    clearInterval(missileAnimationTimer);
  }
}

/**
 * Stop the animation of every aliens
 */
function stopAliensAnimation() {
  if (alienAnimationTimer) {
    clearInterval(alienAnimationTimer);
  }
}

/**
 * Triggered when a key is pressed on th keyboard.
 * Handle the ship move with right and left arrow.
 * Launch missile when pressing space bar
 * @param {*} e keyboard event
 */
function onKeyDown(e) {
  if (isGameInitialzed && !shipIsExploding) {
    switch (e.keyCode) {
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
  } else if (e.keyCode === 13) {
    //Enter key
    if (!isGameInitialzed) {
      isGameInitialzed = true;
      initGame();
    }
  }
}
