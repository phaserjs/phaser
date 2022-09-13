var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('mario', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
}

function create() {
    var level = [
        [ 1,  2,  3,  4,  7,  7,  7],
        [ 5,  6,  7,  7,  4,  4,  7],
        [ 9, 10, 11, 12,  4,  4,  7],
        [13, 14, 15, 16,  7,  7,  7]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: false});
    var tileset = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tileset);

    layer.setCollision([ 2, 5, 6, 7, 10, 11, 15 ]);

    var afterGraphics = this.add.graphics();
    afterGraphics.x = layer.x;
    afterGraphics.y = layer.y + 150;
    afterGraphics.setScale(2, 2);
    layer.renderDebug(afterGraphics);

    // Run only 1 test at a time to compare before and after render debug


    // 1 - putting & recalc
    layer.putTileAt(2, 0, 0); // Good - adds left/top faces

    // 2 - putting & preventing recalc
    // layer.putTileAt(2, 0, 0, false); // Good - adds all faces
    // layer.calculateFacesWithin(); // Good - removes right/bottom and leaves left/top

    // 3 - putting a colliding index after collision set
    // var tile = layer.getTileAt(0, 3);
    // layer.putTileAt(2, 1, 3, false); // Good - no face change
    // layer.putTileAt(2, 1, 3, true); // Good - face edges change

    // 4 - removing
    // layer.removeTileAt(1, 1); // Good - adds all inner faces edges

    // 5 - removing and manual recalc
    // layer.removeTileAt(1, 1, false, false); // Good - doesn't change edges
    // layer.calculateFacesWithin(); // Good - removes right/bottom and leaves left/top

    // 6 - copying and manual recalc
    // layer.copy(0, 0, 2, 2, 4, 0, false); // Good - doesn't change edges
    // layer.calculateFacesWithin(); // Good - removes right/bottom and leaves left/top

    // 7 - Copying
    // layer.copy(0, 0, 2, 2, 4, 1, true); // Good - copies and changes edges (including all neighbors)

    // 8 - Putting a Tile
    // layer.putTileAt(layer.getTileAt(1, 1), 2, 0, false); // Good - all faces collide
    // layer.putTileAt(layer.getTileAt(0, 3), 1, 1, false); // Good - all faces don't collide

    // 9 - Filling
    // layer.fill(2, 1, 1, 5, 2, false); // Good - no face changes
    // layer.fill(2, 1, 1, 5, 2, true); // Good - face changes


    var afterGraphics = this.add.graphics();
    afterGraphics.x = layer.x + 300;
    afterGraphics.y = layer.y + 150;
    afterGraphics.setScale(2, 2);
    layer.renderDebug(afterGraphics);
}

