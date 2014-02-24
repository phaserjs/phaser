/**
 * Created by JP on 07.02.14.
 * The course1.tmx to course3.tmx files can be edited using the free map editor "tiled" (www.mapeditor.org)
 * Use export to create the .json files that are loaded by this game
 * The grass and wood textures are CC0 licensed files from openGameArt.org (grass.png, tiles.png)
 * The ball, arrow and hole are are drawn by Jan Peter Simonsen and licensed CC0 (ball.png, arrow.png, hole.png)
 * CC0: http://creativecommons.org/publicdomain/zero/1.0/
 */

//create the phaser game object
var game = new Phaser.Game(800, 576, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render});

//setup variables, they are explained (commented) as they get used for the first time
var ball, arrow, layer, map, mode, downTime, holes, inputPressed, level, maxLevel, swingCount, infoText;

function preload() {
  //load all images
  game.load.image('ball', 'assets/games/golf/ball.png');
  game.load.image('grass', 'assets/games/golf/grass.png');
  game.load.image('tiles', 'assets/games/golf/tiles.png');
  game.load.image('arrow', 'assets/games/golf/arrow.png');
  game.load.image('hole', 'assets/games/golf/hole.png');

  //Set the level count to 3
  maxLevel = 3;

  //load all levels (filename for the levels is assumed to be "course" followed by the number of the level)
  var i;
  for (i = 1; i <= maxLevel; i++ ) {
    game.load.tilemap('course' + i, 'assets/games/golf/course' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
  }
}

function create() {
  //create a background tiledSprite (so the empty areas of the level are grassy)
  game.add.tileSprite(0, 0, game.width, game.height, 'grass');

  //set the current level to 1
  level = 1;

  //create the ball
  ball = game.add.sprite(100, 100, 'ball', '');
  ball.anchor.setTo(0.5, 0.5);
  //bounce to 0.9 means the ball loses 10% speed on impact
  ball.body.bounce.setTo(0.9, 0.9);
  //the "hitbox" for the ball is a circle with 12 pixel radius
  ball.body.setCircle(12, 12, 12);

  //the ball slows down by itself at this rate
  ball.body.linearDamping = 1.0;

  //used to check if the ball has come to a hold
  ball.body.minVelocity.setTo(1, 1);

  //Set the game to display the level
  loadLevel(level);

  //variable for sprite that holds the arrow, but we don't need it right away
  arrow = null;

  //flag to check if mousekey is down (or if finger is touching down on mobile)
  inputPressed = false;

  //setting up a callback, so that the function inputDown is called every time the screen is touched/the mouse is pressed
  game.input.onDown.add(inputDown, this);
  //call inputUp every time the mouse button is let go / the finger is lifted
  game.input.onUp.add(inputUp, this);

  //On mobiles set the game to scale to fullscreen
  if (!game.device.desktop) {
    this.game.stage.scale.minWidth = game.width / 2;
    this.game.stage.scale.minHeight = game.width / 2;
    this.game.stage.scale.maxWidth = game.width * 2;
    this.game.stage.scale.maxHeight = game.height * 2;
    this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
  }

  //the counter for the amounts of swings it took to complete the game
  swingCount = 0;

  //a short welcome text
  infoText = game.add.text(game.world.centerX - 80, game.world.centerY - 40, 'Let\'s go!', { font: "42pt Arial", fill: "#ff1111", align: "center" });

  mode = -1;
  //initialize current game mode
  setMode(0);
}

function loadLevel(number) {
  //if a level is displayed already we clear up everything
  if (map != null) {
    holes.destroy();
    layer.destroy();
    map.destroy();
  }
  //create a group for the holes (there can be multiple holes in a single level)
  holes = game.add.group();
  //creat the map for the current level
  map = game.add.tilemap('course' + number);
  //create the tileset
  map.addTilesetImage('tiles');
  //set all tiles to collide
  map.setCollisionByExclusion([]);
  //create a layer for the "walls" part of the tileset
  layer = map.createLayer('walls');
  //create holes from the "holes" object-layer of the tileset
  map.createFromObjects('holes', 1, 'hole', '', true, true, holes);
  holes.forEach(function(hole) {
    //set the body for each hole to be only a circle with radius 8,
    //so the ball does not collide if it just touches the outside of the (bigger) hole sprite
    hole.body.setCircle(8, 16, 16);
  }, this);
  //make sure the ball is displayed ontop of everything else
  ball.bringToTop();
}

function inputDown(pointer) {
  inputPressed = true;
}

function inputUp(pointer) {
  inputPressed = false;
}

//adds the arrow to the game (called when the ball is laying still and the player can make his move)
function createArrow() {
  //create the direction arrow
  arrow = game.add.sprite(0, 0, 'arrow');
  arrow.anchor.setTo(0.5, 0.5);
  arrow.pivot.x = 0;
  arrow.pivot.y = +35;
  //add it as a child to the ball, so that it circles the ball
  ball.addChild(arrow);
}

//removes the arrow from the game
function removeArrow() {
  ball.removeChild(arrow);
  arrow.destroy();
}

//set the mode variable and create / destroy the arrow depending on the mode
//mode 1 means the ball is moving
//mode 2 means the ball is laying stil
function setMode(newMode) {
  if (mode != newMode) {
    if (mode == 1) {
      removeArrow();
    } else if (mode == 0) {
      //make sure the ball does not move
      ball.body.velocity.setTo(0,0);
      createArrow();
      downTime = 0;
    }
    mode = newMode;
  }
}

//win is called when the ball hits the hole at the right amount of speed
function win() {
  setMode(0);
  //reset the ball to the start position
  ball.reset(100, 100);
  //if there are more levels, increase the level counter otherwhise reset it to level 1
  if (level < maxLevel) {
    level++
  } else {
    level = 1;
  }
  //load the next (or first) level
  loadLevel(level);

  //if the level is level 1 it means we have played through all levels, display the win message with the swing counter
  if (level == 1) {
    infoText = game.add.text(game.world.centerX-160, game.world.centerY - 40, 'The end - ' + swingCount + ' swings', { font: "32pt Arial", fill: "#ff1111", align: "center" });
    swingCount = 0;
  }
}

//calculate a number between 0 and 500 based on how long the mousebutton/finger is pressed
//this number goes from 0 to 500 and then back down again to 0 and then starts over.
function power() {
  return Math.abs(((game.time.time - downTime + 500) % 1000) -500);
}

//this is the callback for the overlap function between ball and holes
function fallInHole(ball, hole) {
  //if the balls combined x+y speed is below 100 it can fall into the hole
  if ( (ball.body.velocity.x + ball.body.velocity.y) < 100) {
    ball.visible = false; //make the ball invisible (it's in the hole after all), the reset in win makes it visible again
    win();
  }
}

function update() {
  //mode 0 means the ball is moving
  if (mode == 0) {

    //if the ball is moving, remove all info texts if there are any
    if (infoText != null) {
      infoText.destroy();
      infoText = null;
    }

    //collide the ball with the walls
    game.physics.collide(ball, layer);

    //check for the ball hitting the hole
    game.physics.overlap(ball, holes, fallInHole);

    //Check if the ball is moving so slow that we can make it stop completly and switch to swing-mode
    if (Math.abs(ball.body.velocity.x) < ball.body.minVelocity.x && Math.abs(ball.body.velocity.y) < ball.body.minVelocity.y) {
      setMode(1);
    }

  } else if (mode == 1) {
    //mode 1 is the swing mode, the ball is laying still

    //rotate the arrow according to mouse/finger position
    arrow.rotation = game.math.angleBetween(ball.body.x, ball.body.y, game.input.x, game.input.y) + Math.PI/2;

    if (inputPressed) {
      if (downTime == 0) {
        //input has just been pressed, note the time this happend
        downTime = game.time.time;
      } else {
        //scale the arrow lengh according ot the result of the power function (power 0-500) -> arrow size 1.0 to 3.0
        arrow.scale.y = 1.0 + power()/500 * 2;
      }
    } else if (downTime != 0) {
      //the mousebutton has been released (or the finger lifted) now get the ball moving
      ball.body.velocity = game.physics.accelerationFromRotation(arrow.rotation - Math.PI/2, power() + 50);
      //and count it as a swing
      swingCount++;
      //and switch to ball-moving-mode
      setMode(0);
    }
  }
}

function render() {
//optional debug displays
/*
  game.debug.renderPhysicsBody(ball.body);

  holes.forEach(function(hole) {
    game.debug.renderPhysicsBody(hole.body);
  }, this);

  game.debug.renderBodyInfo(ball, 16, 24);
*/
}
