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
    this.load.tilemapTiledJSON('map1', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('tiles1', 'assets/tilemaps/tiles/super-mario.png');

    this.load.tilemapTiledJSON('map3', 'assets/tilemaps/maps/super-mario-3.json');
    this.load.image('tiles3', 'assets/tilemaps/tiles/super-mario-3.png');
}

function create ()
{
    var map1 = this.make.tilemap({ key: 'map1' });
    var tileset1 = map1.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
    var layer1 = map1.createStaticLayer('World1', tileset1, 0, 0);

    var map2 = this.add.tilemap('map3');
    var tileset2 = map2.addTilesetImage('SuperMarioBrosMap1-3_bank.png', 'tiles3');
    var layer2 = map2.createStaticLayer('ShoeBox Tile Grab', tileset2, 700, 300);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        speed: 0.5
    };

    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    this.cameras.main.setBounds(0, 0, layer2.x + layer2.width + 600, 0);
}

function update (time, delta)
{
    controls.update(delta);
}
