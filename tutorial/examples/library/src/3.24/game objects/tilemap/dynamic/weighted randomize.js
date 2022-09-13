var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var groundLayer;
var objectLayer;
var map;

function preload ()
{
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponser)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/tilemaps/tiles/buch-dungeon-tileset.png');
}

function create ()
{
    // Creating a blank tilemap with the specified dimensions
    map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 23, height: 17 });

    var tiles = map.addTilesetImage('tiles');

    groundLayer = map.createBlankDynamicLayer('Ground Layer', tiles);
    objectLayer = map.createBlankDynamicLayer('Object Layer', tiles);
    groundLayer.setScale(2);
    objectLayer.setScale(2);
    this.cameras.main.setScroll(-27, -27);

    // Walls & corners of the room
    groundLayer.fill(39, 0, 0, map.width, 1);
    groundLayer.fill(1, 0, map.height - 1, map.width, 1);
    groundLayer.fill(21, 0, 0, 1, map.height);
    groundLayer.fill(19, map.width - 1, 0, 1, map.height);
    groundLayer.putTileAt(3, 0, 0);
    groundLayer.putTileAt(4, map.width - 1, 0);
    groundLayer.putTileAt(23, map.width - 1, map.height - 1);
    groundLayer.putTileAt(22, 0, map.height - 1);

    randomizeRoom(); // Initial randomization
    this.input.on('pointerdown', randomizeRoom);

    var help = this.add.text(16, 16, 'Click to re-randomize.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    help.setScrollFactor(0);
}

function randomizeRoom ()
{
    // Fill the floor with random ground tiles
    groundLayer.weightedRandomize(1, 1, map.width - 2, map.height - 2, [
        { index: 6, weight: 4 }, // Regular floor tile (4x more likely)
        { index: 7, weight: 1 }, // Tile variation with 1 rock
        { index: 8, weight: 1 }, // Tile variation with 1 rock
        { index: 26, weight: 1 } // Tile variation with 1 rock
    ]);

    // Fill the floor of the room with random, weighted tiles
    objectLayer.weightedRandomize(1, 1, map.width - 2, map.height - 2, [
        { index: -1, weight: 50 }, // Place an empty tile most of the tile
        { index: 13, weight: 3 }, // Empty pot
        { index: 32, weight: 2 }, // Full pot
        { index: 127, weight: 1 }, // Open crate
        { index: 108, weight: 1 }, // Empty crate
        { index: 109, weight: 2 }, // Open barrel
        { index: 110, weight: 2 }, // Empty barrel
        { index: 166, weight: 0.25 }, // Chest
        { index: 167, weight: 0.25 } // Trap door
    ]);
}
