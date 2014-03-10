
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(150, 200, 'atari');
    sprite1.name = 'atari';

    sprite2 = game.add.sprite(700, 220, 'mushroom');
    sprite2.name = 'mushroom';

    game.physics.enable([sprite1,sprite2], Phaser.Physics.ARCADE);

    //  This adjusts the collision body size to be a 100x50 box.
    //  50, 25 is the X and Y offset of the newly sized box.
    
    sprite1.body.setSize(100, 50, 50, 25);
    sprite1.body.immovable = true;

    
    sprite2.body.velocity.x = -100;

}

function update() {

    game.physics.arcade.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

}

function render() {

    // game.debug.bodyInfo(sprite1, 32, 32);

    // game.debug.physicsBody(sprite1.body);
    // game.debug.physicsBody(sprite2.body);

}
