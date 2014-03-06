
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Sprite vs. Sprite collision

    sprite1 = game.add.sprite(50, 200, 'atari');
    sprite1.name = 'atari';
    // sprite1.anchor.set(0.5);

    sprite2 = game.add.sprite(700, 220, 'mushroom');
    sprite2.name = 'mushroom';

    //  Enable the physics bodies of both sprites
    game.physics.enable([sprite1, sprite2]);

    //  And move 'em
    sprite1.body.velocity.x = 100;
    sprite2.body.velocity.x = -100;

}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.arcade.collide(sprite1, sprite2, collisionHandler, null, this);

    // var b = sprite1.getBounds();
    // console.log(b);

}

function collisionHandler (obj1, obj2) {

    //  The two sprites are colliding
    game.stage.backgroundColor = '#992d2d';

}


function render() {

    // var b = sprite1.getBounds();

    // game.debug.geom(b, 'rgba(255,0,0,0.8)', true, 1);

    game.debug.geom(sprite1.body, 'rgba(0,255,0,0.4)', true, 1);
    game.debug.geom(sprite2.body, 'rgba(0,255,0,0.4)', true, 1);

}