
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

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

    game.physics.gravity.y = 20.0;

    game.world.setBounds(0, 0, 2000, 600);

    game.physics.setBoundsToWorld(true, true, false, true, false);

    game.physics.friction = 0.5;
    game.physics.enableBodySleeping = true;
    game.physics.world.solver.stiffness = 1e20;
    game.physics.world.solver.relaxation = 3;

    //  Materials
    var groundMaterial = game.physics.createMaterial('ground');
    var characterMaterial = game.physics.createMaterial('character');
    var boxMaterial = game.physics.createMaterial('box');

    player = game.add.sprite(100, -400, 'dude');
    player.physicsEnabled = true;
    player.body.fixedRotation = true;
    player.body.setMaterial(characterMaterial);
    player.body.mass = 1;
    player.body.damping = 0.5;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    boxes = game.add.group();

    for (var i = 0; i < 100; i++)
    {
        var box = boxes.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'box');
        box.scale.set(game.rnd.realInRange(0.2, 0.6));
        box.physicsEnabled = true;
        box.body.allowSleep = true;
        box.body.mass = 10;
        box.body.setMaterial(boxMaterial);
        box.body.fixedRotation = true;
    }

    //  Set the material along the ground
    game.physics.setWorldMaterial(groundMaterial);

    var groundCharacterCM = game.physics.createContactMaterial(groundMaterial, characterMaterial, { friction: 0.0 }); // no friction between character and ground
    var boxCharacterCM = game.physics.createContactMaterial(boxMaterial, characterMaterial, { friction: 0.0 }); // No friction between character and boxes
    var boxGroundCM = game.physics.createContactMaterial(boxMaterial, groundMaterial, { friction: 0.6 }); // Between boxes and ground

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    bg.tilePosition.x = -game.camera.view.x;

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

    // if (player.debug)
    // {
        game.debug.physicsBody(player.body);
    //     game.debug.bodyInfo(player, 16, 24);
    // }

}
