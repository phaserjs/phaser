var config = {
    type: Phaser.CANVAS,
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
    var map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 17, height: 13});

    var tiles = map.addTilesetImage('tiles');

    var layer1 = map.createBlankDynamicLayer('layer1', tiles);
    layer1.setScale(3);

    // Add a simple scene with some random element
    layer1.fill(58, 0, 10, map.width, 1); // Surface of the water
    layer1.fill(77, 0, 11, map.width, 2); // Body of the water
    layer1.randomize(0, 0, map.width, 10, [ 44, 45, 46, 47, 48 ]); // Wall above the water

    // Place some random platforms
    layer1.putTilesAt([ 104, 105, 106, 107 ], integerInRange(0, 13), 1);
    layer1.putTilesAt([ 104, 105, 105, 106, 107 ], integerInRange(0, 12), 3);
    layer1.putTilesAt([ 104, 105, 106, 107 ], integerInRange(0, 13), 5);
    layer1.putTilesAt([ 104, 105, 105, 106, 107 ], integerInRange(0, 12), 7);
    layer1.putTilesAt([ 104, 105, 105, 106, 106, 107 ], integerInRange(0, 11), 9);

    // The level is ready, so convert it to a static map. This optimizes performance, but means that
    // we can no longer manipulate tiles. The convertLayerToStatic method returns a new
    // StaticTilemapLayer (and the old layer is destroyed), so don't forget to store the returned
    // value if you want to manipulate the new layer.
    layer1 = map.convertLayerToStatic(layer1);

    // Note: only the tile properties are copied into the new static layer, so if we want to keep
    // our layer at 3x scale, we need to do it manually.
    layer1.setScale(3);
}

function integerInRange (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}
