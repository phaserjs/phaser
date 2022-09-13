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

var game = new Phaser.Game(config);

var controls;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/tiles2.png');
}

function create ()
{
    var level = [
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12)),
        Phaser.Utils.Array.Shuffle(Phaser.Utils.Array.NumberArray(0, 12))
    ];

    var map = this.make.tilemap({ data: level, tileWidth: 70, tileHeight: 70 });

    var tiles = map.addTilesetImage('tiles');

    // var layer = map.createDynamicLayer(0, tiles, 0, 0);
    var layer = map.createStaticLayer(0, tiles, 0, 0);
    // this.add.image(0, 0, 'tiles').setOrigin(0);

    var smallCamera = this.cameras.add(800 - 320, 20, 300, 300);
    // smallCamera.rotation = 0.2;
    smallCamera.zoom = 0.5;
    smallCamera.setBackgroundColor('rgba(0, 255, 0, 1)');

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        _camera: smallCamera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };

    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
