
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('flectrum', 'assets/sprites/flectrum.png');

}

var testGroup;
var sprite1;
var sprite2;
var sprite3;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    game.world.setBounds(-1000, -1000, 2000, 2000);

    testGroup = game.add.group();

    test2();

}

function test1 () {

    //  Test 1 - 2 sprites in world space (seems to work fine with local transform?)
    sprite1 = game.add.sprite(-600, 200, 'atari');
    sprite1.name = 'atari';
    // sprite1.body.setSize(100, 100, 0, 0);

    sprite2 = game.add.sprite(-100, 220, 'mushroom');
    sprite2.name = 'mushroom';

    game.camera.focusOn(sprite1);
    game.camera.x += 300;

    game.input.onDown.add(go1, this);

}

function test2 () {

    //  1 sprite in world space (seems to work fine with local transform?) and 1 in a group

    sprite1 = testGroup.create(0, -150, 'atari');
    sprite1.name = 'atari';
    sprite1.body.immovable = true;
    // sprite1.body.setSize(100, 100, 0, 0);

    sprite2 = game.add.sprite(-100, 150, 'mushroom');
    sprite2.name = 'mushroom';

    sprite3 = game.add.sprite(-200, 150, 'flectrum');
    sprite3.name = 'tall';

    testGroup.x = -600;
    testGroup.y = 200;

    game.camera.focusOn(sprite2);
    game.camera.x -= 300;

    game.input.onDown.add(go2, this);

}

function go1 () {

    sprite1.body.velocity.x = 100;
    sprite2.body.velocity.x = -100;

}

function go2 () {

    sprite2.body.velocity.x = -100;

}

function update () {

    game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

    // sprite3.angle += 0.5;

}

function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

    console.log(obj1.name + ' collided with ' + obj2.name);

}

function render() {

    // game.debug.renderSpriteInfo(sprite1, 32, 32);
    // game.debug.renderSpriteCollision(sprite1, 32, 400);

    game.debug.renderSpriteCoords(sprite1, 32, 32);
    game.debug.renderSpriteCoords(sprite2, 300, 32);

    game.debug.renderCameraInfo(game.camera, 32, 500);

    game.debug.renderSpriteBody(sprite1);
    game.debug.renderSpriteBody(sprite2);
    game.debug.renderSpriteBody(sprite3);

    game.debug.renderGroupInfo(testGroup, 500, 500);
    game.debug.renderPixel(testGroup.x, testGroup.y, 'rgb(255,255,0)');

}
