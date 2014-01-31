
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(300, 50, 'atari');
    sprite1.name = 'atari';
    sprite1.body.velocity.y = 100;

    //  This adjusts the collision body size.
    //  220x10 is the new width/height.
    //  See the offset bounding box for another example.
    sprite1.body.setRectangle(220, 10, 0, 0);

    sprite2 = game.add.sprite(400, 450, 'mushroom');
    sprite2.name = 'mushroom';
    sprite2.body.immovable = true;

}

function update() {

    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

}

function render() {

    game.debug.renderPhysicsBody(sprite1.body);
    game.debug.renderPhysicsBody(sprite2.body);

}
