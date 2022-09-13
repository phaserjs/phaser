var config = {
    type: Phaser.AUTO,
    width: 11 * 16, // Number of tiles * size of the tile
    height: 10 * 16,
    zoom: 4,
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
}

function create ()
{
    // Load a map from a 2D array of tile indices
    var level = [
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
      [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
      [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
      [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
    ]

    // When loading from an array, make sure to specify the tileWidth and tileHeight
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createStaticLayer(0, tiles, 0, 0);
}
