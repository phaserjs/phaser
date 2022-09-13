var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#1b262c',
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
var map;
var rockLayer;
var waterLayer;
var platformLayer;
var stuffLayer;
var tileInfoText;

function preload ()
{
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
    this.load.tilemapTiledJSON('multiple-layers-map', 'assets/tilemaps/maps/multiple-layers.json');
}

function create ()
{
    map = this.make.tilemap({ key: 'multiple-layers-map' });
    var tiles = map.addTilesetImage('kenny_platformer_64x64');

    rockLayer = map.createStaticLayer('Rock Layer', tiles, 0, 0);
    waterLayer = map.createStaticLayer('Water Layer', tiles, 0, 0);
    platformLayer = map.createStaticLayer('Platform Layer', tiles, 0, 0);
    stuffLayer = map.createStaticLayer('Stuff Layer', tiles, 0, 0);

    // When you create a layer, that becomes the currently 'selected' layer within the map. That
    // means any tile operation on the map right now will be operating on 'Stuff Layer'.

    // Let's change that:
    selectLayer(platformLayer);

    this.cameras.main.setScroll(0, 1000);

    this.input.keyboard.on('keydown_ONE', function (event) {
        selectLayer(rockLayer);
    });

    this.input.keyboard.on('keydown_TWO', function (event) {
        selectLayer(waterLayer);
    });

    this.input.keyboard.on('keydown_THREE', function (event) {
        selectLayer(platformLayer);
    });

    this.input.keyboard.on('keydown_FOUR', function (event) {
        selectLayer(stuffLayer);
    });

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    tileInfoText = this.add.text(16, 16, '', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    tileInfoText.setScrollFactor(0);

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

    var cam = this.cameras.main;
    var worldPoint = this.input.activePointer.positionToCamera(cam);

    var mapHasTile = map.hasTileAtWorldXY(worldPoint.x, worldPoint.y);
    var platformLayerHasTile = platformLayer.hasTileAtWorldXY(worldPoint.x, worldPoint.y);

    // If you want to use the map and be specific, the last parameter is a layer id. All of the
    // following are valid ways to get something from the rock layer:
    //  map.hasTileAtWorldXY(worldPoint.x, worldPoint.y, cam, rockLayer)
    //  map.hasTileAtWorldXY(worldPoint.x, worldPoint.y, cam, 'Rock Layer')
    //  map.hasTileAtWorldXY(worldPoint.x, worldPoint.y, cam, 0)

    tileInfoText.setText(
        'Press 1/2/3/4 to change the map\'s selected layer' +
        '\nMap\'s selected layer: ' + (map.layer.name) +
        '\nMap hasTileAt pointer: ' + (mapHasTile ? 'yes' : 'no') +
        '\nPlatform layer hasTileAt pointer: ' + (platformLayerHasTile ? 'yes' : 'no')
    );

}

function selectLayer (layer)
{
    // You can use map.setLayer(...) or map.layer. Either can be set using a layer name, layer
    // index, StaticTilemapLayer/DynamicTilemapLayer.
    map.setLayer(layer);

    rockLayer.alpha = 0.5;
    waterLayer.alpha = 0.5;
    platformLayer.alpha = 0.5;
    stuffLayer.alpha = 0.5;

    layer.alpha = 1;
}
