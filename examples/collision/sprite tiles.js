
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('tiles', 'assets/tiles/platformer_tiles.png', 16, 16);
    game.load.image('carrot', 'assets/sprites/carrot.png');

}

var tiles;
var sprite;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    tiles = game.add.group();

    for (var x = 0; x < 40; x++)
    {
        var tile = tiles.create(100 + (x * 16), 300, 'tiles', 4);
        tile.body.immovable = true;
    }

    sprite = game.add.sprite(300, 150, 'carrot');
    sprite.name = 'mushroom';
    sprite.body.collideWorldBounds = true;
    sprite.body.velocity.x = 40;
    sprite.body.velocity.y = 120;
    sprite.body.bounce.setTo(1, 1);

    game.input.onDown.add(carryOn, this);

}

function carryOn() {

    game.paused = false;

}

function update() {

    // object1, object2, collideCallback, processCallback, callbackContext
    game.physics.collide(sprite, tiles, collisionHandler, null, this);

}

function collisionHandler (s, t) {

    t.alpha = 0.5;

    console.log('---------------------------------------------');
    console.log(t.body);

    game.paused = true;

}

function render() {

    // game.debug.renderSpriteInfo(sprite1, 32, 32);
    // game.debug.renderSpriteCollision(sprite1, 32, 400);

    game.debug.renderSpriteBody(sprite);
    // game.debug.renderSpriteBody(sprite2);

}
