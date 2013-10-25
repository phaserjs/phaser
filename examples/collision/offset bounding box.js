
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(50, 200, 'atari');
    sprite1.name = 'atari';
    sprite1.body.velocity.x = 100;

    //  This adjusts the collision body size.
    //  100x50 is the new width/height.
    //  50, 25 is the X and Y offset of the newly sized box.
    //  In this case the box is 50px in and 25px down.
    sprite1.body.setSize(100, 50, 50, 25);

    sprite2 = game.add.sprite(700, 220, 'mushroom');
    sprite2.name = 'mushroom';
    sprite2.body.velocity.x = -100;

}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

    console.log(obj1.name + ' collided with ' + obj2.name);

}

function render() {

    game.debug.renderRectangle(sprite1.body);
    game.debug.renderRectangle(sprite2.body);

}
