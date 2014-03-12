
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('ilkke', 'assets/sprites/ilkke.png');

}

var sprite1;
var sprite2;
var sprite3;
var sprite4;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  Set the world (global) gravity
    game.physics.arcade.gravity.y = 100;

    //  Sprite 1 will use the World (global) gravity
    sprite1 = game.add.sprite(100, 96, 'ilkke');

    //  Sprite 2 is set to ignore the global gravity and use its own value
    sprite2 = game.add.sprite(300, 96, 'ilkke');

    //  Sprite 3 will use both the world gravity and its own gravityScale modifier
    sprite3 = game.add.sprite(500, 96, 'ilkke');

    //  Sprite 4 will ignore all gravity
    sprite4 = game.add.sprite(700, 96, 'ilkke');

    // Enable physics on those sprites
    game.physics.enable( [ sprite1, sprite2, sprite3, sprite4 ], Phaser.Physics.ARCADE);

    sprite1.body.collideWorldBounds = true;
    sprite1.body.bounce.y = 0.8;
    
    sprite2.body.collideWorldBounds = true;
    sprite2.body.bounce.y = 0.8;
    sprite2.body.gravity.y = 200;
    
    sprite3.body.collideWorldBounds = true;
    sprite3.body.bounce.y = 0.8;
    sprite3.body.gravityScale.y = 3;

    sprite4.body.allowGravity = false;

}

function render() {

    game.debug.text('world gravity', sprite1.x - 32, 64);
    game.debug.text('local gravity', sprite2.x - 32, 64);
    game.debug.text('gravityScale', sprite3.x - 32, 64);
    game.debug.text('no gravity', sprite4.x - 32, 64);

}