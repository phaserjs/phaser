var config = {
    type: Phaser.AUTO,
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/iso/tilesets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/iso/hexagonal.json');
}

function create ()
{
    var map = this.add.tilemap('map');

    var tileset = map.addTilesetImage('tileset', 'tiles');

    map.createLayer('Calque 1', tileset);

    var cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(200, 100);

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.02,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
