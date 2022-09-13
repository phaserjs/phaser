var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;
var smallCamera;

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

    smallCamera = this.cameras.add(800 - 320, 20, 300, 300);
    smallCamera.rotation = 0.2;
    smallCamera.zoom = 0.5;
    smallCamera.setBackgroundColor('rgba(0, 0, 0, 1)');

    var controlConfig = {
        camera: smallCamera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    smallCamera.setBounds(0, 0, layer.width, layer.height);

}

function update (time, delta)
{
    controls.update(delta);
}
