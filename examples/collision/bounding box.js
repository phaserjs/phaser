var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(150, 300, 'atari');
    sprite1.name = 'atari';

    //  This adjusts the collision body size to be 104 x 104.
    //  See the offset bounding box for another example.
    sprite1.body.setSize(104, 104, 0, 0);
    sprite1.body.immovable = true;

    sprite2 = game.add.sprite(700, 320, 'mushroom');
    sprite2.name = 'mushroom';
    sprite2.body.velocity.x = -100;

}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

}

function render() {

    game.debug.renderBodyInfo(sprite1, 32, 32);

    game.debug.renderPolygon(sprite1.body.polygons, 'rgb(255,0,0)');
    game.debug.renderPolygon(sprite2.body.polygons, 'rgb(255,0,0)');

}
