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
    this.load.setPath('assets/tilemaps/');

    this.load.image('tiles', [ 'tiles/cybernoid.png', 'tiles/cybernoid_n.png' ]);

    this.load.tilemapTiledJSON('map', 'maps/cybernoid.json');
}

function create ()
{
    var light  = this.lights.addLight(0, 0, 200);

    this.lights.enable().setAmbientColor(0x555555);

    this.input.on('pointermove', function (pointer) {

        light.x = this.cameras.main.scrollX + pointer.x;
        light.y = this.cameras.main.scrollY + pointer.y;

    });

    var map = this.make.tilemap({ key: 'map' });

    var tiles = map.addTilesetImage('cybernoid', 'tiles');

    var layer = map.createDynamicLayer(0, tiles, 0, 0);

    layer.setPipeline('Light2D');

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
}

function update (time, delta)
{
    controls.update(delta);
}
