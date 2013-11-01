
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('mario', 'assets/maps/mario1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('marioTiles', 'assets/maps/mario1.png',16,16);
    game.load.image('player', 'assets/sprites/phaser-dude.png');

}

var map;
var tileset;
var layer;
var p;
var cursors;

function create() {

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    tileset = game.add.tileset('marioTiles');

    //  floor
    tileset.setCollisionRange(80, 97, true, true, true, true);

    //  one-ways
    tileset.setCollisionRange(15, 17, true, true, false, true);

    layer = game.add.tilemapLayer(0, 0, map.layers[0].width*tileset.tileWidth, 600, tileset, map, 0);

    layer.fixedToCamera=false;
 
    layer.resizeWorld();

    

    p = game.add.sprite(32, 32, 'player');

    p.body.gravity.y = 10;
    p.body.bounce.y = 0.4;
    p.body.collideWorldBounds = true;



    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.collide(p,layer);

    p.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        if (p.body.touching.down)
        {
            p.body.velocity.y = -400;
        }
    }
    else if (cursors.down.isDown)
    {
        // game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        p.body.velocity.x = 150;
    }

}

function render() {

    game.debug.renderCameraInfo(game.camera, 32, 32);
    // game.debug.renderSpriteCorners(p);
    game.debug.renderSpriteCollision(p, 32, 320);

}
