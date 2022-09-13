var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var controls;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/level-with-coin-objects.json');
    this.load.spritesheet('coin', 'assets/sprites/coin.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
}

function create ()
{
    map = this.add.tilemap('map');
    var tiles = map.addTilesetImage('ground_1x1');
    var layer = map.createLayer('Tile Layer', tiles);

    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
        frameRate: 16,
        repeat: -1
    });

    // We convert all of the Tiled objects with an ID of 26 into sprites. They will get their width
    // & height from the Tiled tile object. Any custom properties on the tile object will also be
    // passed to the sprite creator (e.g. one of the tile object's has an alpha of 0.5).
    // var coins = map.createFromObjects('Coin Object Layer', 26, { key: 'coin' });

    var coins = map.createFromObjects('Coin Object Layer', { gid: 26, key: 'coin' });

    this.anims.play('spin', coins);

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
}

function update (time, delta)
{
    controls.update(delta);
}
