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
    this.load.spritesheet('dude', ['src/games/firstgame/assets/dude.png', 'src/games/firstgame/assets/dude.png'], { frameWidth: 32, frameHeight: 48 });

    this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });

    var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
    layer = map.createDynamicLayer(0, tileset, 0, 0);
    player = this.add.sprite(48, 40, 'dude');

    // player.setPipeline('Light2D');
    // layer.setPipeline('Light2D');

    // this.lights.enable().setAmbientColor(0xffffff);
    // this.lights.addLight(100, 100, 100).setColor(0xff0000).setIntensity(3.0);
}

function update (){}