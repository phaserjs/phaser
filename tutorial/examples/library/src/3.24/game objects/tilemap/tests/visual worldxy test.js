// Visual test to make sure selecting tiles works with a tileset that has multiple tile sizes.
// Expected behavior for tiles bigger than base size: you can only select them if you click on the
// bottom left of the graphic (the origin of where it is placed in the tilemap).

var config = {
    type: Phaser.CANVAS,
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
var marker;
var tileLayer;
var offsetTileLayer;
var tileLayer2;
var smallTileLayer;

function preload() {
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/features-test.json');

    this.load.spritesheet('coin', 'assets/sprites/coin.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    this.load.image('dangerous-kiss', 'assets/tilemaps/tiles/dangerous-kiss.png');
}

function create() {
    map = this.add.tilemap('map');

    var groundTiles = map.addTilesetImage('ground_1x1');
    var tiles2 = map.addTilesetImage('tiles2');
    var kissTiles = map.addTilesetImage('dangerous-kiss');

    tileLayer = map.createDynamicLayer('Tile Layer 1', groundTiles);
    offsetTileLayer = map.createDynamicLayer('Offset Tile Layer', tiles2);
    tileLayer2 = map.createDynamicLayer('Tile Layer 2', groundTiles);
    smallTileLayer = map.createDynamicLayer('Small Tile Layer', kissTiles);

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

    marker = this.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

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

    var help = this.add.text(16, 16, '', {
 keydownont: '20px Arial',
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}


function update (time, delta)
{
    controls.update(delta);

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Force snapping to base tile size
    var pointerTileX = map.worldToTileX(worldPoint.x, true, this.cameras.main, tileLayer);
    var pointerTileY = map.worldToTileY(worldPoint.y, true, this.cameras.main, tileLayer);
    marker.x = map.tileToWorldX(pointerTileX, this.cameras.main, tileLayer);
    marker.y = map.tileToWorldY(pointerTileY, this.cameras.main, tileLayer);

    if (this.input.manager.activePointer.isDown)
    {
        var tile = map.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        console.log(tile);
        if (tile)
        {
            tile.flipX = !tile.flipX;
            tile.alpha = tile.alpha ? 0.5 : 1;
        }
    }
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
