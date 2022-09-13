var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#333333',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var light;
var player;
var layer;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
    // this.load.image('dude', ['assets/sprites/phaser2.png', 'assets/normal-maps/phaser2_n.png']);
    this.load.spritesheet('dude', ['assets/sprites/phaser2.png', 'assets/normal-maps/phaser2_n.png'], { frameWidth: 382, frameHeight: 331 });
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');

    // this.load.setPath('assets/loader-tests/');
    // this.load.atlas('megaset', [ 'texture-packer-atlas-with-normals-0.png', 'texture-packer-atlas-with-normals-0_n.png' ], 'texture-packer-atlas-with-normals.json');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
    layer = map.createDynamicLayer(0, tileset, 0, 0);

    player = this.add.sprite(400, 300, 'dude', 0);
    // player = this.add.sprite(400, 300, 'megaset', 'phaser2');

    player.setPipeline('Light2D');
    layer.setPipeline('Light2D');

    this.lights.enable().setAmbientColor(0x000055);

    this.lights.addLight(48, 40, 100).setColor(0xff0000).setIntensity(3.0);

    this.lights.addLight(400, 300, 300).setColor(0xff0000).setIntensity(3.0);

}

function update (){}