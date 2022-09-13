var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var layer;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
}

function create ()
{
    //  Load a map from a 2D array of tile indices
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
    ];

    //  When loading from an array, make sure to specify the tileWidth and tileHeight
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });

    var tiles = map.addTilesetImage('mario-tiles');

    layer = map.createStaticLayer(0, tiles, 0, 0).setVisible(false);

    rt = this.add.renderTexture(0, 0, 800, 600);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(layer, 0, 0);
    rt.draw(layer, 200, 0);
    rt.draw(layer, 400, 0);
    rt.draw(layer, 0, 200);
    rt.draw(layer, 200, 200);
    rt.draw(layer, 400, 200);
}
