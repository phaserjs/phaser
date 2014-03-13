
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    // game.load.image('phaser', 'assets/sprites/phaser-ship.png');

}

var map;
var layer;
var cursors;
var sprite;

function create() {

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    
    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    map.setCollisionBetween(1, 12);

    layer.debug = true;

    sprite = game.add.sprite(260, 70, 'phaser');

    game.physics.enable(sprite);

    game.camera.follow(sprite);

    // game.physics.arcade.gravity.y = 500;

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

}

function render() {

    // game.debug.text(sprite.body.deltaAbsX(), 32, 32);
    // game.debug.text(sprite.body.deltaAbsY(), 32, 64);

    // game.debug.text(sprite.body.deltaX(), 400, 32);
    // game.debug.text(sprite.body.deltaY(), 400, 64);

    game.debug.body(sprite);

}
