
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(130, 200, 'atari');
    sprite1.name = 'atari';

    //  In this example the new collision box is much larger than the original sprite
    sprite1.body.setRectangle(400, 50, -100, 20);
    sprite1.body.immovable = true;

    sprite2 = game.add.sprite(700, 210, 'mushroom');
    sprite2.name = 'mushroom';
    sprite2.body.velocity.x = -100;

}

function update() {

    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

}

function render() {

    game.debug.bodyInfo(sprite1, 32, 32);

    game.debug.physicsBody(sprite1.body);
    game.debug.physicsBody(sprite2.body);

}
