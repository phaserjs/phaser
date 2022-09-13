var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#00000',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var controls;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/platformer_tiles.png');
}

function create ()
{
    // Creating a blank tilemap with the specified dimensions
    var map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 18, height: 13});

    var tiles = map.addTilesetImage('tiles');

    var layer = map.createBlankDynamicLayer('layer1', tiles);
    layer.setScale(3);

    // Add a simple scene with some random element. Since there is only one layer, we can use map or
    // layer interchangeably to access tile manipulation methods.
    map.fill(58, 0, 10, map.width, 1); // Surface of the water
    layer.fill(77, 0, 11, map.width, 2); // Body of the water
    map.randomize(0, 0, 8, 10, [ 44, 45, 46, 47, 48 ]); // Left chunk of random wall tiles
    layer.randomize(8, 0, 9, 10, [ 20, 21, 22, 23, 24 ]); // Right chunk of random wall tiles
}
