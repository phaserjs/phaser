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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/iso/iso-64x64-outside.png');
    this.load.image('tiles2', 'assets/tilemaps/iso/iso-64x64-building.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/iso/isorpg.json');
}

function create ()
{
    var map = this.add.tilemap('map');

    console.log(map);

    var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
    var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

    var layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
    var layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
    var layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
    var layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
    var layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);

    var cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setZoom(2);

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
}

function update (time, delta)
{
    controls.update(delta);
}
