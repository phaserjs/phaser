var config = {
    type: Phaser.CANVAS,
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
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('tiles', 'assets/tilemaps/tiles/super-mario.png');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    var layer = map.createStaticLayer('World1', tileset, 100, 200);

    layer.width = 400;

    var cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    // controls.update(delta);
}
