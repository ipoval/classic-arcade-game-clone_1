/* Base class for the Player and an Enemy */
var Unit = function(x, y, sprite) {
  this.x      = x;
  this.y      = y;
  this.width  = 101;
  this.sprite = Resources.get(sprite);
};

// Draw the enemy or player on the screen, required method for game
Unit.prototype.render = function(canvasContext) {
  canvasContext.drawImage(this.sprite, this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(x, y) {
  Unit.call(this, x, y, 'images/enemy-bug.png');
  this.speed = 200;
};

Enemy.prototype = Object.create(Unit.prototype);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // Multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for all computers.
  if ( this.x <= ctx.canvas.width + this.width ) {
    this.x += this.speed * dt;
  } else {
    this.x = 0;
    this.speed = this.getSpeed();
  }
};

/* Randomly calculate an enemie's speed after each loop */
Enemy.prototype.getSpeed = function() {
  return Math.floor(Math.random() * 200) + 100;
};

var Player = function(x, y) {
  Unit.call(this, x, y, 'images/char-horn-girl.png');
};

Player.prototype = Object.create(Unit.prototype);

/* Update player's coorinates on the game's grid */
Player.prototype.update = function(x, y) {
  if ( x === undefined || y === undefined ) { return; }
  this.x += x;
  this.y += y;
};

/* Player moves up, down, left and right */
Player.prototype.handleInput = function(direction) {
  if (direction === 'up')    { this._checkBorders(0, -83)  && this.update(0, -83);  }
  if (direction === 'down')  { this._checkBorders(0, 83)   && this.update(0, 83);   }
  if (direction === 'left')  { this._checkBorders(-101, 0) && this.update(-101, 0); }
  if (direction === 'right') { this._checkBorders(101, 0)  && this.update(101, 0);  }
};

/* Check if the player's coordinates overlap with an enemie's */
Player.prototype.checkCollisions = function(enemies) {
  var player = this,
    collide = false;

  enemies.forEach(function(enemy) {
    var dx = player.x - enemy.x,
        dy = player.y - enemy.y;
    if ( dy === 0 && dx >= 0 && dx < 90) { collide = true; return; }
  });

  return collide;
};

/* Check if player reached the water */
Player.prototype.reachedWater = function() {
  return this.y <= 0;
};

/* Make sure the unit coordinates are in the game grid */
Player.prototype._checkBorders = function(dx, dy) {
  var x = this.x + dx,
      y = this.y + dy;
  return x >= 0 && y + 50 > 0 && x < ctx.canvas.width && y + 151 < ctx.canvas.height;
};

var allEnemies,
  player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
