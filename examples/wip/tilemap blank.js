
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');

}

var map;
var tileset;
var layer;
var cursors;

function create() {

    game.stage.backgroundColor = '#787878';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Creates a layer and sets-up the map dimensions.
    //  In this case the map is 30x30 tiles in size and the tiles are 32x32 pixels in size.
    map.create('level1', 30, 30, 32, 32);

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');
    
    map.putTile(4, 1, 1)
    map.putTile(10, 2, 1)
    map.putTile(10, 3, 1)
    map.putTile(10, 4, 1)

    //  Create a layer. This is where the map is rendered to.
    layer = map.createLayer('level1');

    // layer.resizeWorld();
    // map.setCollisionBetween(1, 12);
    // layer.debug = true;

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
    }
    else if (cursors.right.isDown)
    {
    }

    if (cursors.up.isDown)
    {
    }
    else if (cursors.down.isDown)
    {
    }

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);

}
