var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var controls;

function preload ()
{
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
}

function create ()
{
    // Load a blank map with a 32 x 32 px tile size. This is the base tile size. This means that
    // tiles in the map will be placed on a 32 x 32 px grid.
    var map = this.make.tilemap({ width: 200, height: 200, tileWidth: 32, tileHeight: 32 });

    // You can also change the base tile size of map like this:
    // map.setBaseTileSize(32, 32);

    // Load a 32 x 64 px tileset. This tileset was designed to allow tiles to overlap vertically, so
    // placing them on a 32 x 32 grid is exactly what we want.
    var tiles = map.addTilesetImage('walls_1x2', null, 32, 64);

    // Create a layer filled with random trees
    var layer = map.createBlankDynamicLayer('layer1', tiles);

    layer.randomize(0, 0, map.width, map.height, [ 0, 1, 2, 3, 4, 5, 6, 7 ]);

    console.log(layer);
    console.log(layer.layer);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    var help = this.add.text(16, 16, 'Arrows to scroll', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);
}

