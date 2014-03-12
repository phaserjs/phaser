
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    game.load.image('player', 'assets/sprites/phaser-dude.png');
    game.load.image('box', 'assets/sprites/ufo.png');
    game.load.image('ship', 'assets/sprites/thrust_ship2.png');

}

var ship;
var map;
var tileset;
var layer;
var p;
var b;
var cursors;
var box2;
var dump;

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('map');

    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');
    
    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    map.setCollisionBetween(1, 12);

    // layer.debug = true;

    dump = game.physics.p2.convertTilemap(map, layer);

    box2 = game.add.sprite(200, 200, 'box');
    game.physics.p2.enable(box2);
    box2.body.fixedRotation = true;

    game.camera.follow(box2);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    box2.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
        box2.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
        box2.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
        box2.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        box2.body.moveDown(200);
    }

}

function render() {

    // for (var i = 0, len = dump.length; i < len; i++)
    // {
    //     game.debug.physicsBody(dump[i]);
    // }

}
