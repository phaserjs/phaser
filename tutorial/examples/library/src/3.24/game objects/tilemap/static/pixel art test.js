var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: false,
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
    this.load.tilemapTiledJSON('map1', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('tiles1', 'assets/tilemaps/tiles/super-mario.png');
}

function create ()
{
    var map1 = this.make.tilemap({ key: 'map1' });
    var tileset1 = map1.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
    var layer1 = map1.createStaticLayer('World1', tileset1, 0, 0).setScale(2.5);

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

    this.cameras.main.setBounds(0, 0, layer1.x + layer1.width, layer1.height * 3);
}

function update (time, delta)
{
    controls.update(delta);
}
