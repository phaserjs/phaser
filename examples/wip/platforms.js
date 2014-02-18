
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
var box1;
var box2;

function create() {

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    // map = game.add.tilemap('level1');

    // map.addTilesetImage('tiles-1');

    // map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    // layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    // layer.resizeWorld();

    // game.physics.setBoundsToWorld();

    game.physics.gravity.y = 20;
    game.physics.friction = 0.5;

    //  Materials
    var groundMaterial = game.physics.createMaterial('ground');
    var characterMaterial = game.physics.createMaterial('character');
    var boxMaterial = game.physics.createMaterial('box');

    player = game.add.sprite(32, 320, 'dude');
    player.physicsEnabled = true;
    player.body.fixedRotation = true;
    player.body.setMaterial(characterMaterial);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    box1 = game.add.sprite(200, 300, 'box');
    box1.physicsEnabled = true;
    // box1.body.fixedRotation = true;
    box1.body.setMaterial(boxMaterial);

    box2 = game.add.sprite(400, 300, 'box');
    box2.physicsEnabled = true;
    // box2.body.fixedRotation = true;
    box2.body.setMaterial(boxMaterial);

    //  Set the material along the ground
    game.physics.setWorldMaterial(groundMaterial, false, false, false, true);

    var groundCharacterCM = game.physics.createContactMaterial(groundMaterial, characterMaterial, { friction: 0.0 }); // no friction between character and ground
    var boxCharacterCM = game.physics.createContactMaterial(boxMaterial, characterMaterial, { friction: 0.0 }); // No friction between character and boxes
    var boxGroundCM = game.physics.createContactMaterial(boxMaterial, groundMaterial, { friction: 0.6 }); // Between boxes and ground

    // game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.moveLeft(150);

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(150);

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
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

    // if (player.debug)
    // {
    //     game.debug.renderPhysicsBody(player.body);
    //     game.debug.renderBodyInfo(player, 16, 24);
    // }

}
