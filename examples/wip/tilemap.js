
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/maps/newtest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/maps/ground_1x1.png', 32, 32);
    // game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    game.load.image('phaser', 'assets/sprites/mushroom2.png');

}

var cursors;
var map;
var layer;
var sprite;

function create() {

    game.stage.backgroundColor = '#5c94fc';

    map = game.add.tilemap('map');

    map.setCollisionByIndex(1);

    // Phaser.TilemapLayer = function (game, x, y, renderWidth, renderHeight, tileset, tilemap, layer) {
    
    layer = game.add.tilemapLayer(0, 0, 800, 600, null, map, 0);

    // tileset = game.add.tileset('tilesNes');
    // layer = game.add.tilemapLayer(0, 0, map.layers[0].width*tilesetNes.tileWidth, 600, tileset, map, 0);

    //  disable this and you can place anywhere, but will almost certainly screw collision
    // layer.fixedToCamera=false;

    //  this screws something up - not quite sure what, but needs investigating!
    // layer.resizeWorld();

    sprite = game.add.sprite(120, 510, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);
    // sprite.angle = 5;

    // game.camera.follow(sprite);

    cursors = game.input.keyboard.createCursorKeys();

    game.input.onDown.add(dump, this);


}

function dump() {

    console.log(sprite.bounds);
    console.log(sprite.body.hull);
    console.log('wy', sprite.world.y);

}

function update() {

    /*
    if (cursors.left.isDown)
    {
        layer.scrollX -= 4;
    }
    else if (cursors.right.isDown)
    {
        layer.scrollX += 4;
    }

    if (cursors.up.isDown)
    {
        layer.scrollY -= 4;
    }
    else if (cursors.down.isDown)
    {
        layer.scrollY += 4;
    }
    */

    game.physics.collide(sprite, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 150;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -150;
        sprite.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 150;
        sprite.scale.x = 1;
    }


}

function render() {

    game.debug.renderSpriteBody(sprite);
    // game.debug.renderSpriteBounds(sprite);

    game.debug.renderText(sprite.x, 32, 32);
    game.debug.renderText(sprite.y, 32, 64);

}