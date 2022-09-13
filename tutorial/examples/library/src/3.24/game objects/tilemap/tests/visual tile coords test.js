// Visual test to make sure selecting tile world coordinates properly factor in scale, scroll and
// layer position. Expected behavior for tiles bigger/smaller than base size: you can only select
// them if you click on the bottom left of the graphic (the origin of where it is placed in the
// tilemap).

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
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
var map;
var tileLayer;
var offsetTileLayer;
var tileLayer2;
var smallTileLayer;
var text;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/features-test.json');

    this.load.spritesheet('coin', 'assets/sprites/coin.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    this.load.image('dangerous-kiss', 'assets/tilemaps/tiles/dangerous-kiss.png');
}

function create ()
{
    map = this.add.tilemap('map');

    var groundTiles = map.addTilesetImage('ground_1x1');
    var tiles2 = map.addTilesetImage('tiles2');
    var kissTiles = map.addTilesetImage('dangerous-kiss');

    tileLayer = map.createDynamicLayer('Tile Layer 1', groundTiles);
    offsetTileLayer = map.createDynamicLayer('Offset Tile Layer', tiles2, 50, 100);
    tileLayer2 = map.createDynamicLayer('Tile Layer 2', groundTiles);
    tileLayer2.setScale(0.75);
    smallTileLayer = map.createDynamicLayer('Small Tile Layer', kissTiles);
    smallTileLayer.setScale(2);

    selectLayer(tileLayer);

    this.input.keyboard.on('keydown_ONE', function (event) {
        selectLayer(tileLayer);
    });

    this.input.keyboard.on('keydown_TWO', function (event) {
        selectLayer(offsetTileLayer);
    });

    this.input.keyboard.on('keydown_THREE', function (event) {
        selectLayer(tileLayer2);
    });

    this.input.keyboard.on('keydown_FOUR', function (event) {
        selectLayer(smallTileLayer);
    });

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

    text = this.add.text(16, 16, '', {
        font: '20px Arial',
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
}


function update (time, delta)
{
    controls.update(delta);

    var message = [ 'Press 1/2/3/4 to select layers' ];

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    message.push('Mouse Position: ' + worldPoint.x + ', ' + worldPoint.y);

    var tile = map.getTileAtWorldXY(worldPoint.x, worldPoint.y);
    if (tile)
    {
        message.push('Tile Center Position: ' + tile.getCenterX() + ', ' + tile.getCenterY());
        message.push('Tile Bounds: ' + tile.getLeft() + ', ' + tile.getTop() + ' -> ' + tile.getRight() + ', ' + tile.getBottom());
    }

    text.setText(message);
}

function selectLayer (layer)
{
    map.setLayer(layer);
    tileLayer.alpha = 0.5;
    offsetTileLayer.alpha = 0.5;
    tileLayer2.alpha = 0.5;
    smallTileLayer.alpha = 0.5;
    layer.alpha = 1;
}
