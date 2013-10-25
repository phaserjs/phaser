
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('desert', 'assets/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/tiles/tmw_desert_spacing.png', 32, 32, -1, 1, 1);
    game.load.image('car', 'assets/sprites/car90.png');

}

var map;
var tileset;
var layer;

var cursors;
var sprite;

function create() {

    map = game.add.tilemap('desert');

    tileset = game.add.tileset('tiles');
    
    layer = game.add.tilemapLayer(0, 0, 800, 600, tileset, map, 0);

    layer.resizeWorld();

    sprite = game.add.sprite(450, 80, 'car');
    sprite.anchor.setTo(0.5, 0.5);

    game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.addOnce(replaceTiles, this);

}

function replaceTiles() {

    //  This will replace every instance of tile 31 (cactus plant) with tile 46 (the sign post).
    //  It does this across the whole layer of the map unless a region is specified.

    //  You can also pass in x, y, width, height values to control the area in which the replace happens

    map.replace(31, 46);

}

function update() {

    game.physics.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 200;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.copyFrom(game.physics.velocityFromAngle(sprite.angle, 300));
    }

}

function render() {

    game.debug.renderText('Click to replace tiles', 32, 32, 'rgb(0,0,0)');
    game.debug.renderText('Tile X: ' + layer.getTileX(sprite.x), 32, 48, 'rgb(0,0,0)');
    game.debug.renderText('Tile Y: ' + layer.getTileY(sprite.y), 32, 64, 'rgb(0,0,0)');

}
