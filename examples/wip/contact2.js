
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
    game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.image('box', 'assets/sprites/block.png');

}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var boxes;

function create() {

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    game.physics.gravity.y = 20;
    game.physics.friction = 0.5;
    // game.physics.setBoundsToWorld();

    var playerCG = game.physics.createCollisionGroup();
    var boxCG = game.physics.createCollisionGroup();

    player = game.add.sprite(50, 550, 'dude');
    player.name = 'player';
    player.physicsEnabled = true;
    player.body.fixedRotation = true;
    player.body.setCollisionGroup(playerCG);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    boxes = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var box = boxes.create(200 + (i * 50), 550, 'box');
        box.name = 'box' + i;
        box.scale.set(0.5);
        box.physicsEnabled = true;
        box.body.setCollisionGroup(boxCG);
        box.body.collides(playerCG);
        box.body.fixedRotation = true;
    }

    //  Because player is creating the collides callback, the parameter order will be: callback (playerBody, boxBody, playerShape, boxShape)
    player.body.collides(boxCG, gotBox, this);


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function gotBox(body1, body2, shape1, shape2) {

    console.log('gotBox', body1.sprite.name, body2.sprite.name);

    body2.sprite.kill();

}

function update() {

    if (cursors.left.isDown)
    {
        player.body.moveLeft(200);

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(200);

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        player.body.velocity.x = 0;

        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && game.time.now > jumpTimer && checkIfCanJump())
    {
        player.body.moveUp(300);
        jumpTimer = game.time.now + 750;
    }

}

function checkIfCanJump(){
var yAxis = p2.vec2.fromValues(0,1);
var result = false;
for(var i=0; i<game.physics.world.narrowphase.contactEquations.length; i++){
  var c = game.physics.world.narrowphase.contactEquations[i];
  if(c.bi === player.body.data || c.bj === player.body.data){
    var d = p2.vec2.dot(c.ni,yAxis); // Normal dot Y-axis
    if(c.bi === player.body.data) d *= -1;
    if(d > 0.5) result = true;
  }
}
return result;
}


function render () {

    game.debug.physicsBody(player.body);

}
