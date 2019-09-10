/* App.js
 * This file contains the classes for the game objects.
 */

// Class for the game characters
class Character {
  constructor(x, y, pic) {
    // Set image/sprite for the character
    this.sprite = `images/${pic}.png`;
    // Set coordinates for the character
    this.x = x;
    this.y = y;
  }

  // Draw the character on the screen
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Class for the enemies the player must avoid
class Enemy extends Character {
  constructor(x, y, pic) {
    super(x, y, pic);
    // Set a coefficient to generate a random speed for the enemy's movements
    this.speedCoefficient = Math.ceil(Math.random() * 3);
  }

  // Update the enemy's position
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // Any movement is multiplied by the dt parameter to ensure the game runs at
    // the same speed for all computers
    this.x += this.speedCoefficient * 75 * dt; // Move the enemy to the right
    // Check if the enemy has reached the end of the canvas
    if (this.x > ctx.canvas.width) {
      // Reposition the enemy at the start of the canvas
      this.x = -101;
      // Generate a new random speed for the enemy
      this.speedCoefficient = Math.ceil(Math.random() * 3);
    }
  }
}

// Class for the player
class Player extends Character {
  constructor(x, y, pic) {
    super(x, y, pic);
    this.scoreCounter = 0;
    this.scoreBoard = document.getElementById('score');
    this.startPos = [x, y];
    this.isReady = true; // Indicate the player's ability to handle input
    this.wantsToMove = false;
    this.direction;
  }

  // Check if the player is on a specific row
  // Helper method for the checkCollisions() function defined in engine.js file
  isOnRow(num) {
    if (num === 1) return this.y === 60;
    if (num === 2) return this.y === 145;
    if (num === 3) return this.y === 230;
  }

  // Handle the input respecting the limits of the canvas
  handleInput(pressedKey) {
    if ((pressedKey === 'left' && this.x > 0) ||
        (pressedKey === 'up' && this.y > -25) ||
        (pressedKey === 'right' && this.x < 404) ||
        (pressedKey === 'down' && this.y < 400)) {
          this.wantsToMove = true;
          this.direction = pressedKey;
        }
  }

  // Move the player in one direction
  move(direction) {
    if (direction === 'left') this.x -= 101; // Step left
    if (direction === 'up') this.y -= 85; // Step up
    if (direction === 'right') this.x += 101; // Step right
    if (direction === 'down') this.y += 85; // Step down
  }

  // Update the player's score
  updateScore(num) {
    if (num === 0) {
      this.scoreCounter = num; // Reset the score to 0
    } else {
      this.scoreCounter += 1; // Increment the score by 1
    }
    // Show the updated score on the page
    this.scoreBoard.textContent = this.scoreCounter;
  }

  // Perform update for the player
  update() {
    // Check if the player has reached the goal
    if (this.isReady && this.y === -25) {
      this.isReady = false;
      this.updateScore(); // Increment score by 1
      setTimeout(() => {
        // Reposition the player at the starting spot after brief delay
        [this.x, this.y] = this.startPos;
        this.isReady = true;
      }, 500);
    } else if (this.isReady && this.wantsToMove) {
      this.move(this.direction); // Move the player
      this.wantsToMove = false;
    }
  }
}

// Instantiate the enemies for the game and place them all in an array
let allEnemies = [
  new Enemy(-101, 60, 'enemy-bug'),
  new Enemy(-200, 60, 'enemy-bug'),
  new Enemy(-150, 145, 'enemy-bug'),
  new Enemy(-300, 145, 'enemy-bug'),
  new Enemy(-175, 230, 'enemy-bug'),
  new Enemy(-250, 230, 'enemy-bug'),
];

// Group enemies by row
let firstRowEnemies = [allEnemies[0], allEnemies[1]],
    secondRowEnemies = [allEnemies[2], allEnemies[3]],
    thirdRowEnemies = [allEnemies[4], allEnemies[5]];

// Instantiate the player for the game
let player = new Player(202, 400, 'char-boy');

// This listens for key presses and sends the keys to player.handleInput()
document.addEventListener('keyup', function(e) {
  const ALLOWED_KEYS = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  if (player.isReady) player.handleInput(ALLOWED_KEYS[e.keyCode]);
});
