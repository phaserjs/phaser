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
    this.load.image('ground', 'assets/tilemaps/tiles/kenny_ground_64x64.png');
    this.load.image('items', 'assets/tilemaps/tiles/kenny_items_64x64.png');
    this.load.image('platformer', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/multi-tileset.json');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });

    var groundTiles = map.addTilesetImage('kenny_ground_64x64', 'ground');

    map.createStaticLayer('Tile Layer 1', groundTiles, 0, 0);

    var itemTiles = map.addTilesetImage('kenny_items_64x64', 'items');

    map.createStaticLayer('Tile Layer 1', itemTiles, 0, 0);

    var platformTiles = map.addTilesetImage('kenny_platformer_64x64', 'platformer');

    map.createStaticLayer('Tile Layer 1', platformTiles, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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

    var help = this.add.text(16, 16, 'Arrow keys to scroll', {
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
