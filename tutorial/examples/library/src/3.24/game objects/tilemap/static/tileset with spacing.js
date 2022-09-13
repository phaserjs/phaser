var config = {
    type: Phaser.CANVAS,
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
var controls;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
    this.load.image('Desert', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.image('drawtiles-spaced', 'assets/tilemaps/tiles/drawtiles-spaced.png');
}

function create ()
{
    // 1 - Tilesets loaded from Tiled will having the spacing properties already set

    var map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('Desert');
    var layer = map.createStaticLayer(0, tiles, 0, 0);
    layer.setScrollFactor(0.5);
    layer.setAlpha(0.75);


    // 2 - Tilesets loaded outside of a Tiled JSON file will need the spacing properties set (if
    // your tileset has a margin or padding)

    var level = [
        [ 2, 2, 2, 2 ],
        [ 2, 2, 2, 2 ],
        [ 2, 2, 2, 2 ],
        [ 2, 2, 2, 2 ]
    ];
    var map2 = this.make.tilemap({ tileWidth: 32, tileHeight: 32, data: level });

    // addTilesetImage Parameters:
    //  tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing
    var tiles2 = map2.addTilesetImage('drawtiles-spaced', null, 32, 32, 1, 2);

    var layer2 = map2.createStaticLayer(0, tiles2, 200, 200);
    layer2.setScale(2);


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
