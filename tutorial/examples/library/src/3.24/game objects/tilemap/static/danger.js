var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/dangerous-kiss-x2.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/dangerous-kiss.json');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });

    // The map was created with 8x8 tiles, but we want to load it with a 2x high resolution tileset
    map.setBaseTileSize(16, 16);

    var tileset = map.addTilesetImage('DangerousKiss_bank.png', 'tiles', 16, 16);

    var layer = map.createStaticLayer('ShoeBox Tile Grab', tileset, 0, 0);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.cameras.main.setBounds(0, 0, layer.width, layer.height);
}

function update (time, delta)
{
    controls.update(delta);
}
