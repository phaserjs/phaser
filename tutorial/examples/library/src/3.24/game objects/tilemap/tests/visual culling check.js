var config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 800,
    backgroundColor: '#2d2d88',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var totalTests = 0;
var testsPassed = 0;
var assert = (message, condition) => {
    totalTests++;
    if (condition) testsPassed++;
    console.assert(condition, message)
};

var game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('desert', 'assets/tilemaps/maps/desert.json');
    this.load.image('desert-tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');

    this.load.tilemapTiledJSON('mario', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('SuperMarioBros-World1-1', 'assets/tilemaps/tiles/super-mario.png');

    this.load.tilemapTiledJSON('features-test', 'assets/tilemaps/maps/features-test.json');
    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('dangerous-kiss', 'assets/tilemaps/tiles/dangerous-kiss.png');
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
}

function create() {
    // Visual test to make sure tiles are culled properly when factoring in:
    // - Layer position
    // - Scroll factor
    // - Layer scale
    // - Maps that have multiple tilesizes

    // Static map with offset, scroll factor & scale
    var map = this.make.tilemap({ key: 'desert' });
    var tiles = map.addTilesetImage('Desert', 'desert-tiles', 32, 32, 1, 1);
    var layer = map.createStaticLayer(0, tiles, -300, -400);
    layer.setScrollFactor(0.25);

    // Dynamic map with offset, scroll factor & scale
    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1');
    var layer = map.createStaticLayer(0, tiles, 50, -25);
    layer.setScrollFactor(1);
    layer.setScale(2, 0.5);

    // Map with multiple tileset sizes
    var map = this.make.tilemap({ key: 'features-test' });
    var ground_1x1 = map.addTilesetImage('ground_1x1');
    var tiles2 = map.addTilesetImage('tiles2');
    var dangerousTiles = map.addTilesetImage('dangerous-kiss');
    var layer = map.createDynamicLayer('Tile Layer 1', ground_1x1, 0, 300);
    var layer2 = map.createStaticLayer('Offset Tile Layer', tiles2, 0, 300);
    var layer3 = map.createDynamicLayer('Small Tile Layer', dangerousTiles, 300, 300).setScrollFactor(0.5);

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
