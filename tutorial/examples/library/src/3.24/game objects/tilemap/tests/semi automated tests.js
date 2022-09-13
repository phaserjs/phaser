// Note: this is not a "proper" set of controlled tests with a testing framework. These integration
// tests make sure the whole Tilemap API doesn't have major holes in it and works as expected. It
// compliments the visual examples and tests.

var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var totalTests = 0;
var testsPassed = 0;
var assert = (message, condition) => {
    totalTests++;
    if (condition) testsPassed++;
    console.assert(condition, message);
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.tilemapTiledJSON('mario', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
    this.load.image('tomato', 'assets/sprites/tomato.png');
    this.load.tilemapTiledJSON('multiple-layers-map', 'assets/tilemaps/maps/multiple-layers.json');
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
    this.load.image('catastrophi-tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    this.load.tilemapCSV('catastrophi-level3', 'assets/tilemaps/csv/catastrophi_level3.csv');
    this.load.tilemapTiledJSON('features-test-map', 'assets/tilemaps/maps/features-test.json');
    this.load.spritesheet('coin', 'assets/sprites/coin.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
    this.load.image('dangerous-kiss', 'assets/tilemaps/tiles/dangerous-kiss.png');
    this.load.tilemapTiledJSON('tileset-collision-shapes-automated-test', 'assets/tilemaps/maps/tileset-collision-shapes-automated-test.json');
}

function create()
{
    testCollision.call(this);
    testCallbacks.call(this);
    testInterestingFaces.call(this);
    testAddRemoveLayers.call(this);
    test2DArray.call(this);
    testCreatingFromTiledObjects.call(this);
    testGettingTiles.call(this);
    testMakeAndAdd.call(this);
    testManipulatingTiles.call(this);
    testSelectingWithMultipleLayers.call(this);
    testTileCopying.call(this);
    testTiledObjectLayerAndImport.call(this);

    console.log(`${testsPassed} / ${totalTests} tests passed`);
}

function testCollision ()
{
    var level = [
        [ 0,  0, -1, -1, -1,  0,  0],
        [ 0,  0,  0, 10,  0,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [14, 14, 14, 14, 14, 14, 14],
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16, insertNull: true });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createStaticLayer(0, tiles);


    // -- SETTING COLLISION ON TILE ---

    var tile = map.getTileAt(0, 0);
    tile.setCollision(true, false, true, false);
    assert('Tile should collide', tile.collides);
    assert('Tile should have an interesting face', tile.hasInterestingFace);
    assert('Tile should be able to collide', tile.canCollide);
    assert('Tile should collide only on left and top side',
        tile.collideLeft && tile.collideUp && !tile.collideRight && !tile.collideDown
    );

    tile.resetCollision();
    assert('Tile should NOT collide', !tile.collides);
    assert('Tile should NOT have an interesting face', !tile.hasInterestingFace);
    assert('Tile should NOT able to collide', !tile.canCollide);


    // -- SETTING COLLISION CALLBACK ON TILE ---

    var tile = map.getTileAt(0, 5);
    tile.setCollisionCallback(() => {}, null);
    assert('Tile should NOT collide', !tile.collides);
    assert('Tile should NOT have an interesting face', !tile.hasInterestingFace);
    assert('Tile should be able to collide', tile.canCollide);

    tile.setCollisionCallback(null);
    assert('Tile should NOT be able to collide', !tile.canCollide);


    // -- SETTING COLLISION FOR LAYER ---

    map.setCollision(0);
    assert('28 tiles with index 0 should now collide',
        map.filterTiles(tile => tile.collides).length === 28
    );
    map.setCollision(0, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    map.setCollision([ 10, 13 ]);
    assert('Two tiles (id: 10 and 13) should collide',
        map.filterTiles(tile => tile.collides).length === 2
    );
    map.setCollision([ 10, 13 ], false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    map.setCollisionBetween(10, 14);
    assert('11 tiles (id: 10, 13, 14) should collide',
        map.filterTiles(tile => tile.collides).length === 11
    );
    map.setCollisionBetween(10, 14, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );
    map.setCollisionBetween(15, 0);
    assert('Setting stop < start should set no tiles to collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    map.setCollisionByExclusion(0);
    assert('All non-0 tiles should collide (11 tiles)',
        map.filterTiles(tile => tile.collides).length === 11
    );
    map.setCollisionByExclusion(0, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );


    map.setCollisionByExclusion([ 13, 10 ]);
    assert('All non-13 and non-10 tiles should collide (37 tiles)',
        map.filterTiles(tile => tile.collides).length === 37
    );
    map.setCollisionByExclusion([ 13, 10 ], false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    // -- COLLIDE INDEXES ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles);

    map.setCollisionBetween(1, 10);
    assert('Internal collide indexes should have index 1 - 10',
        are1DArrayEqual(layer.layer.collideIndexes, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
    );
    map.setCollisionBetween(1, 10, false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollision([ 1, 2, 16 ]);
    assert('Internal collide indexes should only have index 1, 2, 16',
        are1DArrayEqual(layer.layer.collideIndexes, [ 1, 2, 16 ])
    );
    map.setCollision([ 1, 2, 16 ], false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollision(2);
    assert('Internal collide indexes should only have index 2',
        are1DArrayEqual(layer.layer.collideIndexes, [ 2 ])
    );
    map.setCollision(2, false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollisionByExclusion([1, 2, 3, 4]);
    assert('Internal collide indexes should everything except 1 - 4',
        are1DArrayEqual(layer.layer.collideIndexes, [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ])
    );
    map.setCollisionByExclusion([1, 2, 3, 4], false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollisionBetween(1, 5);
    map.setCollision([ 1, 2, 16 ]);
    assert('Internal collide indexes should everything except 1 - 4 plus 16 without duplicates',
        are1DArrayEqual(layer.layer.collideIndexes, [ 1, 2, 3, 4, 5, 16 ])
    );
    map.setCollisionBetween(1, 5, false);
    map.setCollision([ 1, 2, 16 ], false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollisionByExclusion([ 1, 2, 3, 4 ]);
    map.setCollisionBetween(1, 16);
    assert('Internal collide indexes should everything except 1 - 4 plus 1 -4 at the end, no duplicates',
        are1DArrayEqual(layer.layer.collideIndexes, [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 2, 3, 4 ])
    );
    map.setCollisionByExclusion([ 1, 2, 3, 4 ], false);
    map.setCollisionBetween(1, 16, false);
    assert('Internal collide indexes should be empty',
        layer.layer.collideIndexes.length === 0
    );

    map.setCollisionBetween(1, 5);
    map.putTileAt(1, 3, 3);
    assert('Putting a colliding tile index should collide',
        map.getTileAt(3, 3).collides
    );
    map.putTileAt(6, 3, 3);
    assert('Putting a non-colliding tile index should NOT collide',
        !map.getTileAt(3, 3).collides
    );
    map.removeTileAt(0, 0);
    assert('Removing a colliding tile should NOT collide',
        !map.getTileAt(0, 0, true).collides
    );


    // -- COLLIDE BY PROPERTY ---

    var level = [
        [ 1,  1,  1,  1],
        [ 2,  2,  2,  2],
        [ 3,  3,  3,  3],
        [ 4,  4,  4,  4]
    ];
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles);

    // 4 sand tiles, 4 rock tiles, 4 solid tiles, 4 slope=1 tiles
    map.forEachTile(t => {
        if (t.index === 1) t.properties.type = 'sand';
        else if (t.index === 2) t.properties.type = 'rock';
        else if (t.index === 3) t.properties.solid = true;
        else if (t.index === 4) t.properties.slope = 1;
    });

    map.setCollisionByProperty({ type: 'sand' }, true);
    var collidingTiles = map.filterTiles(tile => tile.collides);
    assert('Only the 4 sand tiles should collide',
        collidingTiles.length === 4 &&
        collidingTiles.every(tile => tile.properties.type === 'sand')
    );
    map.setCollisionByProperty({ type: 'sand' }, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    map.setCollisionByProperty({ type: [ 'sand', 'rock' ] }, true);
    var collidingTiles = map.filterTiles(tile => tile.collides);
    assert('Only the 8 sand & rock tiles should collide',
        collidingTiles.length === 8 &&
        collidingTiles.every(tile => [ 'sand', 'rock' ].includes(tile.properties.type))
    );
    map.setCollisionByProperty({ type: [ 'sand', 'rock' ] }, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );

    map.setCollisionByProperty({ type: [ 'rock' ], solid: true, slope: 1 }, true);
    var collidingTiles = map.filterTiles(tile => tile.collides);
    assert('Only the 12 rock, solid and slope=1 tiles should collide',
        collidingTiles.length === 12 &&
        collidingTiles.every(
            tile => tile.properties.type === 'rock' ||
                tile.properties.solid ||
                tile.properties.slope === 1
        )
    );
    map.setCollisionByProperty({ type: [ 'rock' ], solid: true, slope: 1 }, false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );


    // -- SET COLLIDE BY COLLISION DATA ---

    var map = this.make.tilemap({ key: 'tileset-collision-shapes-automated-test' });
    var tiles = map.addTilesetImage('kenny_platformer_64x64');
    var layer = map.createDynamicLayer(0, tiles);

    // 5 x 6 map
    // First 4 rows - different colliding shapes are set
    // Row 5 - colliding shapes created and then deleted (this leaves an empty collision group)
    // Row 6 - no collision shapes ever defined
    map.setCollisionFromCollisionGroup(true);

    assert('Rows one - four should collide',
        map.filterTiles(tile => tile.collides, null, 0, 0, 5, 4).length === 5 * 4
    );
    assert('Rows five - six should NOT collide',
        map.filterTiles(tile => tile.collides, null, 0, 4, 5, 2).length === 0
    );
    map.setCollisionFromCollisionGroup(false);
    assert('No tiles should collide',
        map.filterTiles(tile => tile.collides).length === 0
    );
}

function testInterestingFaces ()
{
    // -- INTERESTING FACES ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createStaticLayer(0, tiles);

    map.setCollisionBetween(1, 16);
    assert('All edge tiles should have an interesting face (12 total)',
        map.filterTiles(tile => tile.hasInterestingFace).length === 12
    );
    map.setCollisionBetween(1, 16, false);
    assert('There should be no interesting faces',
        map.filterTiles(tile => tile.hasInterestingFace).length === 0
    );

    map.setCollision([ 2, 5, 6, 7, 10, 11 ]);
    var faces = map.getTilesWithin()
        .filter((tile) => tile.hasInterestingFace);
    assert('Colliding tiles (except for id 6) should have an interesting face (12 total)',
        map.filterTiles(tile => tile.hasInterestingFace).length === 5
    );
    var tile = map.getTileAt(1, 0);
    assert('Tile id 2 should only have an interesting left, right & top face',
        tile.faceLeft && tile.faceRight && tile.faceTop && !tile.faceBottom
    );
    var tile = map.getTileAt(2, 1);
    assert('Tile id 7 should only have an interesting right & top face',
        !tile.faceLeft && tile.faceRight && tile.faceTop && !tile.faceBottom
    );

    // -- INTERESTING FACE RECALCULATION ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: true});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles);

    map.setCollision([ 2, 5, 6, 7, 10 ]);
    assert('Index 2 should NOT have an interesting face bottom',
        !map.getTileAt(1, 0).faceBottom
    );
    map.removeTileAt(1, 1, false, false); // Don't recalc
    assert('Prevent recalculation - index 2 should still NOT have an interesting face bottom',
        !map.getTileAt(1, 0).faceBottom
    );
    layer.calculateFacesWithin();
    assert('Recalculation - index 2 should now have an interesting face bottom',
        map.getTileAt(1, 0).faceBottom
    );
    map.setCollision([ 2, 5, 6, 7, 10 ], false);
    assert('There should be no interesting faces',
        map.filterTiles(tile => tile.hasInterestingFace).length === 0
    );

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: true});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles);

    map.setCollision([2, 5, 6, 7, 10], true, false); // no recalc
    assert('Should have default interesting faces setting - all colliding are interesting',
        map.filterTiles(tile => tile.hasInterestingFace).length === 5
    );
    map.calculateFacesWithin();
    assert('Recalculate faces - center tiles (id: 6) should no longer be interesting',
        map.filterTiles(tile => tile.hasInterestingFace).length === 4
    );


    // -- INTERESTING FACE RECALCULATION VIA TILE.COLLIDES ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: true});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles);

    map.setCollision([ 2, 5, 6, 7, 10 ]);
    assert('Index 2 should NOT have an interesting face bottom',
        !map.getTileAt(1, 0).faceBottom
    );

    map.getTileAt(1, 1).resetCollision(true);
    assert('Index 2 should have an interesting face bottom',
        map.getTileAt(1, 0).faceBottom
    );

    map.getTileAt(1, 1).setCollision(true, true, true, true, true);
    assert('Index 2 should NOT have an interesting face bottom',
        !map.getTileAt(1, 0).faceBottom
    );
}

function testCallbacks ()
{
    // -- TILE CALLBACKS ---

    var level = [
        [ 1,  1,  1,  1],
        [ 2,  2,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: true});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createStaticLayer(0, tiles);

    var cb = () => {};
    map.setTileIndexCallback(1, cb, 3);
    assert('Tile index 1 should have a callback',
        map.layer.callbacks[1].callback === cb && map.layer.callbacks[1].callbackContext === 3
    );
    map.setTileIndexCallback(2, cb, 4);
    assert('Tile index 2 should have a callback',
        map.layer.callbacks[2].callback === cb && map.layer.callbacks[2].callbackContext === 4
    );
    layer.setTileIndexCallback(1, null);
    assert('Tile index 1 should have its callback removed',
        map.layer.callbacks[1] === undefined
    );

    // -- TILE LOCATION CALLBACKS ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16, insertNull: true});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createStaticLayer(0, tiles);

    var cb = () => {};
    map.setTileLocationCallback(0, 0, 2, 2, cb, 3);
    assert('Tiles from (0, 0) to (2, 2) should have the same callback & context',
        map.getTilesWithin(0, 0, 2, 2).every(tile => tile.collisionCallback === cb) &&
        map.getTilesWithin(0, 0, 2, 2).every(tile => tile.collisionCallbackContext === 3)
    );
    assert('Only 9 tiles should have a callback',
        map.filterTiles(tile => tile.collisionCallback !== undefined)
    );
    layer.setTileLocationCallback(0, 0, 2, 2, null);
    assert('Tiles from (0, 0) to (2, 2) should have their callback & context removed',
        map.getTilesWithin(0, 0, 2, 2).every(tile => tile.collisionCallback === undefined) &&
        map.getTilesWithin(0, 0, 2, 2).every(tile => tile.collisionCallbackContext === undefined)
    );
}

function testAddRemoveLayers ()
{
    // --- CREATING AND DELETING LAYERS ------------------------------------------------------------

    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');

    // --- LAYERS MUST BE UNIQUE ---

    var layer = map.createStaticLayer(0, tiles, 0, 0);
    assert('Layer 1 should have been successfully created (non-null value)',
        layer
    );

    var layer2 = map.createStaticLayer(0, tiles, 100, 100);
    assert('Two layers are not allowed to be created from the same LayerData - should return null',
        layer2 === null
    );

    layer.destroy();
    assert('Destroyed layer should release LayerData for another layer to use',
        layer.layer === undefined
    );

    layer2 = map.createStaticLayer(0, tiles, 100, 100);
    assert('Destroyed layer should release LayerData for another layer to use',
        layer2 !== null
    );

    // --- REMOVING LAYERS ---

    map.removeAllLayers();
    assert('All LayerData should be removed',
        map.layers.length === 0
    );
    assert('TilemapLayers should be destroyed',
        !layer.scene
    );
    assert('TilemapLayers should be unlinked from LayerData',
        !layer.layer
    );

    // --- DESTROYING MAP ---

    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
    var layer = map.createStaticLayer(0, tiles, 0, 0);

    map.destroy();
    assert('All LayerData should be removed',
        map.layers.length === 0
    );
    assert('TilemapLayers should be destroyed',
        !layer.scene
    );
    assert('TilemapLayers should be unlinked from LayerData',
        !layer.layer
    );
}

function test2DArray ()
{
    // -- BASIC ARRAY LOADING  ---

    var level = [
        [  0,  0, -1, -1, -1,  0,  0 ],
        [  0,  0,  0, 10,  0,  0,  0 ],
        [  0,  0, 14, 13, 14,  0,  0 ],
        [  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  0,  0,  0,  0,  0,  0 ],
        [ 14, 14, 14, 14, 14, 14, 14 ]
    ];
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16, insertNull: false });

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('widthInPixels should be 16 * 7',
        map.widthInPixels === 16 * 7 && map.layers[0].widthInPixels === 16 * 7
    );
    assert('heightInPixels should be 16 * 6',
        map.heightInPixels === 16 * 6 && map.layers[0].heightInPixels === 16 * 6
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );


    // -- ARRAY LOADING WITH NULL INSERTION ---

    var level = [
        [   0,   0,  -1, null,  -1,   0,   0 ],
        [   0,   0,   0,   10,   0,   0,   0 ],
        [   0,   0,  14,   13,  14,   0,   0 ]
    ];
    var map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32, insertNull: true });

    assert('Tile width should be 32',
        map.tileWidth === 32 && map.layers[0].tileWidth === 32
    );
    assert('Tile height should be 32',
        map.tileHeight === 32 && map.layers[0].tileHeight === 32
    );
    assert('widthInPixels should be 32 * 7',
        map.widthInPixels === 32 * 7 && map.layers[0].widthInPixels === 32 * 7
    );
    assert('heightInPixels should be 32 * 3',
        map.heightInPixels === 32 * 3 && map.layers[0].heightInPixels === 32 * 3
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Tile at (2, 0) should be null',
        map.layers[0].data[0][2] === null
    );
    assert('Tile at (3, 0) should be null',
        map.layers[0].data[0][3] === null
    );
    assert('Tile at (4, 0) should be null',
        map.layers[0].data[0][4] === null
    );
}

function testCreatingFromTiledObjects ()
{
    var level = [
        [ 1,  2,  3,  4,  7,  7,  7, 10, 11, 12, 13, 14, 15, 16, 17],
        [ 5,  6,  7,  7,  4,  4,  7, 10, 11, 12, 13, 14, 15, 16, 17],
        [ 9, 10, 11, 12,  4,  4,  7, 10, 11, 12, 13, 14, 15, 16, 17],
        [13, 14, 15, 16,  7,  7,  7, 10, 11, 12, 13, 14, 15, 16, 17]
    ];
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tileset = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tileset);

    var sprites = map.createFromTiles(7, null, {
        key: 'tomato', flipY: true, scale: 1, origin: 0, alpha: 0.5
    });
    assert('Tiles with index 7 should be unchanged - there should still be 10',
        map.filterTiles(tile => tile.index === 7).length === 10
    );
    assert('10 sprites should be created',
        sprites.length === 10
    );
    assert('Sprites should have an alpha of 0.5',
        sprites.every(sprite => alpha = 0.5)
    );

    var sprites = map.createFromTiles(4, -1, {
        key: 'tomato', scale: 0.5, origin: 0, alpha: 0.5
    });
    assert('Tiles with index 4 should have been changed to -1',
        layer.filterTiles((tile) => tile.index === 4).length === 0
        && layer.filterTiles((tile) => tile.index === -1).length === 5
    );

    var sprites = layer.createFromTiles([ 10, 11 ], 20, {
        key: 'tomato', scale: 0.5, origin: 0, alpha: 0.5
    });
    assert('Tiles with index 10 & 11 should have been changed to 20',
        map.filterTiles((tile) => tile.index === 10).length === 0
        && map.filterTiles((tile) => tile.index === 11).length === 0
        && map.filterTiles((tile) => tile.index === 20).length === 10
    );

    var set1 = map.filterTiles((tile) => tile.index === 12);
    var set2 = map.filterTiles((tile) => tile.index === 13);
    var sprites = map.createFromTiles([ 12, 13 ], [ 21, 22 ], {
        key: 'tomato', scale: 0.5, origin: 0, alpha: 0.5
    });
    assert('Tiles with index 12 should have been changed to 21',
        set1.every(tile => tile.index === 21)
    );
    assert('Tiles with index 13 should have been changed to 22',
        set2.every(tile => tile.index === 22)
    );
}

function testGettingTiles ()
{
    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
    var layer = map.createStaticLayer('World1', tiles, 300, 300);

    // -- GETTING TILES FROM JSON ---

    assert('Map and layer should both be able to get the same tile (id 11)',
        layer.getTileAt(16, 8).index === 11 && map.getTileAt(16, 8).index === 11
    );
    assert('Map should get tile from layer when index is passed in for layerID',
        map.getTileAt(16, 8, 0).index === 11
    );
    assert('Map should get tile from layer when string is passed in for layerID',
        map.getTileAt(16, 8, 'World1').index === 11
    );
    assert('Map should get tile from layer when TilemapLayer is passed in for layerID',
        map.getTileAt(16, 8, layer).index === 11
    );
    assert('There should be a tile at (3, 3)',
        map.hasTileAt(3, 3) && layer.hasTileAt(3, 3)
    );
    assert('There should be no tile outside bounds',
        !map.hasTileAt(0, 50000) && !layer.hasTileAt(0, 50000)
    );
    assert('There should be no tile outside bounds',
        !map.hasTileAtWorldXY(-100, 100) && !layer.hasTileAtWorldXY(-100, 100)
    );
    assert('Getting a tile in world coords',
        !map.hasTileAtWorldXY(-100, 100) && !layer.hasTileAtWorldXY(-100, 100)
    );

    // -- GETTING TILES 2D ARRAY ---

    var level = [
        [ 6, -1,  1,  2,  3,  0,  5],
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0, 10,  0,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [14, 14, 14, 14, 14, 14, 14],
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 300, 275);

    assert('Getting an -1 tile at (1, 0) should return null',
        layer.getTileAt(1, 0) === null && map.getTileAt(1, 0) === null
    );
    assert('Getting a tile location out of bounds should return null',
        layer.getTileAt(-10, 0) === null && map.getTileAt(-10, 0) === null
    );
    assert('Getting an -1 tile at (1, 0) with nonNull should return a -1 index tile',
        map.getTileAt(1, 0, true).index === -1
    );
    assert('Getting a tile at (0, 0) return ID 6',
        map.getTileAt(0, 0).index === 6
    );

    assert('Getting tiles without specifying region should return all tiles',
        map.getTilesWithin().length === 6 * 7
    );
    assert('Getting tiles with a 1x1 area should return one tile',
        are1DArrayEqual(map.getTilesWithin(3, 3, 1, 1).map(t => t.index), [ 13 ])
    );
    assert('Getting tiles with a region that goes off the map should be clipped',
        are1DArrayEqual(map.getTilesWithin(-4, -4, 5, 5).map(t => t.index), [ 6 ])
    );

    // --- GETTING TILES WITH FILTERS ---

    var level = [
        [ 6, -1,  1,  2,  3, -1,  5],
        [ 0, -1,  0,  0,  0, -1,  0],
        [ 0,  0,  0, 14,  0,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [14, 14, 14, 14, 14, 14, 14],
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 600, 275);

    var nonEmpty = map.getTilesWithin(0, 0, map.width, map.height, { isNotEmpty: true });
    assert('getTilesWithin isNotEmpty option should filter out index -1',
        nonEmpty.length > 0 && nonEmpty.every(tile => tile.index !== -1)
    );

    map.setCollision([ -1, 13, 14 ]);
    var colliding = layer.getTilesWithin(0, 0, map.width, map.height, { isColliding: true });
    assert('getTilesWithin isColliding option should filter out non-colliding tiles',
        colliding.length > 0 && colliding.every(tile => tile.collides)
    );

    var interesting = map.getTilesWithin(0, 0, map.width, map.height, { hasInterestingFace: true });
    assert('getTilesWithin hasInterestingFace option should filter out non-interesting tiles',
        interesting.length > 0 && interesting.every(tile => tile.hasInterestingFace)
    );

    var allOptions = layer.getTilesWithin(0, 0, map.width, map.height, {
        isNotEmpty: true,
        isColliding: true,
        hasInterestingFace: true
    });
    assert('getTilesWithin with all options should filter out non-interesting, non-colliding, empty tiles',
        allOptions.length > 0 && allOptions.every(
            tile => tile.index !== -1 && tile.collides && tile.hasInterestingFace
        )
    );
    var allOptions = map.getTilesWithinWorldXY(layer.x, layer.y, 1000000, 1000000, {
        isNotEmpty: true,
        isColliding: true,
        hasInterestingFace: true
    });
    assert('getTilesWithinWorldXY with all options should filter out non-interesting, non-colliding, empty tiles',
        allOptions.length > 0 && allOptions.every(
            tile => tile.index !== -1 && tile.collides && tile.hasInterestingFace
        )
    );
    var forEachArray = [];
    layer.forEachTile(t => forEachArray.push(t), null, 0, 0, map.width, map.height, {
        isNotEmpty: true,
        isColliding: true,
        hasInterestingFace: true
    });
    assert('forEachTile with all options should match getTilesWithin with all options',
        are1DArrayEqual(forEachArray, allOptions)
    );

    // --- FINDING TILES ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 600, 275);

    layer.getTileAt(3, 3).alpha = 0.25;
    layer.getTileAt(2, 2).alpha = 0.25;
    layer.getTileAt(3, 3).setCollision(true);

    assert('findTile for alpha 0.25 should return first tile with alpha 0.25 (ID 11)',
        map.findTile(t => t.alpha === 0.25).index === 11
    );

    assert('findTile for non-existent ID should return null',
        map.findTile(t => t.index === 3000) === null
    );

    var foundTile = map.findTile(t => t.alpha === 0.25, null, 0, 0, map.width, map.height, {
        isColliding: true
    });
    assert('findTile for colliding, alpha 0.25 should return ID 16', foundTile.index === 16);
}

function testMakeAndAdd ()
{
    // --- ADD JSON ---

    var map = this.add.tilemap('mario');
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
    var layer = map.createDynamicLayer('World1', tiles, 0, 0);

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Map should have a non-empty tile',
        layer.filterTiles(t => t.index !== -1).length > 0
    );

    // --- MAKE JSON ---

    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
    var layer = map.createDynamicLayer('World1', tiles, 0, 300);

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Map should have a non-empty tile',
        layer.filterTiles(t => t.index !== -1).length > 0
    );

    // --- MAKE 2D ---

    var level = [
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0, 10,  0,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [14, 14, 14, 14, 14, 14, 14],
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 0);

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Map should have a non-empty tile',
        layer.filterTiles(t => t.index !== -1).length > 0
    );

    // --- ADD 2D ARRAY ---

    var level = [
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0, 10,  0,  0,  0],
        [ 0,  0, 14, 13, 14,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [ 0,  0,  0,  0,  0,  0,  0],
        [14, 14, 14, 14, 14, 14, 14],
    ]
    var map = this.add.tilemap(null, 16, 16, null, null, level);
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 150, 0);

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Map should have a non-empty tile',
        layer.filterTiles(t => t.index !== -1).length > 0
    );

    // --- ADD NON-EXISTENT KEY ---

    var map = this.add.tilemap('non-existent key');

    assert('Tile width should be default 32',
        map.tileWidth === 32
    );
    assert('Tile height should be default 32',
        map.tileHeight === 32
    );
    assert('Map should have 0 layers',
        map.layers.length === 0
    );

    // --- MAKE BLANK ---

    var map = this.make.tilemap({ tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createBlankDynamicLayer('layer1', tiles, 0, 100, 3, 3);
    map.fill(11);

    assert('Tile width should be 16',
        map.tileWidth === 16 && map.layers[0].tileWidth === 16
    );
    assert('Tile height should be 16',
        map.tileHeight === 16 && map.layers[0].tileHeight === 16
    );
    assert('Map should have 1 layer',
        map.layers.length === 1
    );
    assert('Map should have a non-empty tile',
        layer.filterTiles(t => t.index !== -1).length > 0
    );
}

function testManipulatingTiles()
{
    // --- FILL ---

    var level = [
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 0);

    map.fill(11);
    assert('Fill without region specified should fill whole map',
        map.filterTiles(t => t.index === 11).length === 5 * 6
    );

    map.fill(12, 0, 0, 1, 1);
    assert('Fill with a 1x1 should fill one tile',
        map.filterTiles(t => t.index === 12).length === 1
    );

    map.fill(13, 2, 1, 2, 3);
    assert('Fill with a 2x3 should fill 6 tiles',
        map.filterTiles(t => t.index === 13).length === 6
    );

    map.fill(14, -2, -1, 3, 2);
    assert('Fill outside of bounds should be clipped',
        map.filterTiles(t => t.index === 14).length === 1
    );

    // --- SHUFFLE ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 100);

    map.shuffle();
    var sortedIndexes = map.getTilesWithin()
        .map(t => t.index)
        .sort((a, b) => a - b);
    assert('Shuffle should add or remove tile indexes',
        are1DArrayEqual(sortedIndexes, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ])
    );

    // --- RANDOMIZE ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 200);

    map.randomize();
    var incorrectIndexes = map.filterTiles(t => t.index < 1 || t.index > 16);
    assert('Randomize should not add tile indexes that are not in the map',
        incorrectIndexes.length === 0
    );

    map.randomize(0, 0, 4, 4, [ 17, 18, 19 ]);
    var incorrectIndexes = map.filterTiles(t => t.index < 17 || t.index > 19);
    assert('Randomize should not use tile indexes other than those provided',
        incorrectIndexes.length === 0
    );

    // --- WEIGHTED RANDOMIZE ---

    var level = [
        [ 0,  0,  0,  0],
        [ 0,  0,  0,  0],
        [ 0,  0,  0,  0],
        [ 0,  0,  0,  0]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 200);

    map.weightedRandomize();
    var incorrectIndexes = map.filterTiles(t => t.index !== 0);
    assert('weightedRandomize without weights should not change the map',
        incorrectIndexes.length === 0
    );

    map.weightedRandomize(0, 0, 4, 4, [ { index: 1, weight: 0 } ]);
    var incorrectIndexes = map.filterTiles(t => t.index !== 0);
    assert('weightedRandomize with zero total for the weights should not change the map',
        incorrectIndexes.length === 0
    );

    map.weightedRandomize(0, 0, 4, 4, [
        { index: 1, weight: 1 }, { index: 2, weight: 2 }, { index: 3, weight: 1 } ]
    );
    var incorrectIndexes = map.filterTiles(t => t.index < 1 && t.index > 3);
    assert('weightedRandomize weighted inputs should fill the region with only IDs specified',
        incorrectIndexes.length === 0
    );

    // --- REPLACE & SWAP ---

    var level = [
        [ 1,  1,  1,  1],
        [ 2,  2,  2,  2],
        [ 3,  3, 13, 13],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 300);

    map.replaceByIndex(1, 20);
    assert('Replace should change all ID 1 -> ID 20',
        map.filterTiles(t => t.index === 20).length === 4
    );

    map.swapByIndex(2, 3);
    assert('Swap should change all ID 2 -> ID 3',
        map.filterTiles(t => t.index === 2).length === 2
    );
    assert('Swap should change all ID 3 -> ID 2',
        map.filterTiles(t => t.index === 3).length === 4
    );

    // --- COPY ---

    var level = [
        [ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    var map = this.make.tilemap({data: level, tileWidth: 16, tileHeight: 16});
    var tiles = map.addTilesetImage('mario-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 400);

    layer.copy(0, 0, 2, 2, 2, 2);
    var destIndexes = map.getTilesWithin(2, 2, 2, 2).map(t => t.index);
    assert('Copy should copy tile indexes to the destination',
        are1DArrayEqual(destIndexes, [ 1, 2, 5, 6 ])
    );

    map.copy(-5, -5, 7, 7, 2, 0);
    var destIndexes = map.getTilesWithin(2, 0, 2, 2).map(t => t.index);
    assert('Copy with source/dest out of bounds should be clipped',
        are1DArrayEqual(destIndexes, [ 1, 2, 5, 6 ])
    );
}

function testSelectingWithMultipleLayers ()
{
    var map = this.make.tilemap({ key: 'multiple-layers-map' });
    var tiles = map.addTilesetImage('kenny_platformer_64x64');

    var layer1 = map.createStaticLayer(0, tiles, 0, 0);
    assert('layer1 should be selected after being created',
        map.layer === layer1.layer
    );

    var layer2 = map.createStaticLayer(1, tiles, 0, 0);
    assert('layer1 should NOT be selected after layer 2 is created',
        map.layer !== layer1.layer
    );
    assert('layer2 should be selected after being created',
        map.layer === layer2.layer
    );

    var layer3 = map.createStaticLayer(2, tiles, 0, 0);
    var layer4 = map.createStaticLayer(3, tiles, 0, 0);

    map.setLayer('Rock Layer');
    assert('Set layer should work with string',
        map.layer === layer1.layer
    );

    map.setLayer(1);
    assert('Set layer should work with index',
        map.layer === layer2.layer
    );

    map.setLayer(layer3);
    assert('Set layer should work with TilemapLayer',
        map.layer === layer3.layer
    );

    map.layer = 'Stuff Layer';
    assert('Layer getter should work with string',
        map.layer === layer4.layer
    );

    assert('(0, 0) from layer 1 should have tile id 10',
        map.setLayer(0).getTileAt(0, 0).index === 10
    );
    assert('(0, 0) from layer 2 should have tile id 10',
        map.setLayer(1).getTileAt(0, 0, false, layer1).index === 10
    );
    assert('(1, 1) from layer 1 should be null',
        map.setLayer(0).getTileAt(1, 1) === null
    );
    assert('(1, 24) from layer 2 should be tile id 7',
        map.setLayer(layer2).getTileAt(1, 24).index === 7
    );
    assert('(26, 3) from layer 3 should be tile id 19',
        map.setLayer(2).getTileAt(26, 3).index === 19
    );
}

function testTileCopying()
{
    var map = this.make.tilemap({ key: 'mario' });
    var tiles = map.addTilesetImage('SuperMarioBros-World1-1', 'mario-tiles');
    var layer = map.createDynamicLayer('World1', tiles, 0, 0);

    // --- TILE COPYING ---

    var tile1 = layer.getTileAt(9, 3);
    tile1.alpha = 0.5;
    tile1.flipX = true;
    tile1.flipY = true;
    tile1.visible = false;
    tile1.rotation = 0.1;
    var tile2 = layer.getTileAt(1, 1).copy(tile1);
    assert('Copied tile should NOT have x/y copied',
        tile1.x !== tile2.x && tile1.y !== tile2.y
    );
    assert('Copied tile should have index, alpha, visible, rotation and flip copied',
        tile1.index === tile2.index &&
        tile1.visible === tile2.visible &&
        tile1.alpha === tile2.alpha &&
        tile1.rotation === tile2.rotation &&
        tile1.flipX === tile2.flipX &&
        tile1.flipY === tile2.flipY
    );

    // --- PUTTING A TILE OBJECT ---

    var map = this.make.tilemap({key: 'catastrophi-level3', tileWidth: 16, tileHeight: 16});
    var tiles = map.addTilesetImage('catastrophi-tiles');
    var layer = map.createDynamicLayer(0, tiles, 0, 200);

    var tile1 = layer.getTileAt(20, 10);
    tile1.flipX = true;
    tile1.flipY = true;
    var tile2 = map.putTileAt(tile1, 0, 0);

    assert('Put tile should NOT have x/y copied',
        tile1.x !== tile2.x && tile1.y !== tile2.y
    );
    assert('Copied tile should have index, alpha, visible, rotation and flip copied',
        tile1.index === tile2.index &&
        tile1.visible === tile2.visible &&
        tile1.alpha === tile2.alpha &&
        tile1.rotation === tile2.rotation &&
        tile1.flipX === tile2.flipX &&
        tile1.flipY === tile2.flipY
    );
}

function testTiledObjectLayerAndImport ()
{
    var map = this.add.tilemap('features-test-map');

    var groundTiles = map.addTilesetImage('ground_1x1');
    var coinTiles = map.addTilesetImage('coin');
    var wallTiles = map.addTilesetImage('walls_1x2');
    var tiles2 = map.addTilesetImage('tiles2');
    var kissTiles = map.addTilesetImage('dangerous-kiss');

    var tileLayer = map.createStaticLayer('Tile Layer 1', groundTiles);
    var offsetTileLayer = map.createStaticLayer('Offset Tile Layer', tiles2);
    var tileLayer2 = map.createStaticLayer('Tile Layer 2', groundTiles);
    var smallTileLayer = map.createStaticLayer('Small Tile Layer', kissTiles);

    // -- LAYER OFFSET ---

    assert('tileLayer should have no offset',
        tileLayer.x === 0 && tileLayer.y === 0
    );
    assert('offsetTileLayer should have (64, 32) offset from Tiled',
        offsetTileLayer.x === 64 && offsetTileLayer.y === 32
    );

    // -- CREATE FROM OBJECTS ---

    var coins = map.createFromObjects('Object Layer 1', 'coin', { key: 'coin', frame: 0});
    assert('Should create 1 coin',
        coins.length === 1
    );
    var coins = map.createFromObjects('Object Layer 1', 34, { key: 'coin', frame: 0, origin: { x: 0.5, y: 0.5} });
    assert('Should create 8 coins',
        coins.length === 8
    );
    var coins = map.createFromObjects('Object Layer 1', 'small-coin', { key: 'coin', frame: 0, origin: { x: 0.5, y: 0.5} });
    assert('Should create 7 coins',
        coins.length === 7
    );

    // -- OBJECT LAYER ---

    var objectLayer = map.getObjectLayer('Object Layer 1');

    assert('Should have an object layer',
        objectLayer
    );
    assert('Should have 13 objects',
        objectLayer.objects.length === 13
    );

    var coin = map.findObject('Object Layer 1', obj => obj.id === 3);
    assert('Should contain object at id 3',
        coin
    );
    assert('Should have coin (id = 3) data matching tiled export',
        doesObjectContain(coin, {
            id: 3,
            name: 'coin',
            type: 'collectible',
            x: 391,
            y: 207,
            visible: true,
            gid: 34,
            rotation: 90,
            flippedHorizontal: true,
            flippedVertical: false,
            properties: { alpha: 0.5 }
        })
    );

    var exit = map.findObject('Object Layer 1', obj => obj.id === 1);
    assert('Should contain object at id 1',
        exit
    );
    assert('Should have exit (id = 1) data matching tiled export',
        doesObjectContain(exit, {
            id: 1,
            name: 'exit',
            type: 'door',
            x: 475,
            y: 430,
            width: 44,
            height: 114,
            rectangle: true,
            visible: true,
            rotation: 0,
            properties: { open: false }
        })
    );

    var sun = map.findObject('Object Layer 1', obj => obj.id === 2);
    assert('Should contain object at id 2',
        sun
    );
    assert('Should have exit (id = 2) data matching tiled export',
        doesObjectContain(sun, {
            id: 2,
            name: 'sun',
            type: 'collision',
            x: 793,
            y: 340,
            width: 77,
            height: 70,
            visible: true,
            rotation: 0,
            ellipse: true
        })
    );

    var ramp = map.findObject('Object Layer 1', obj => obj.id === 11);
    assert('Should contain object at id 11',
        ramp
    );
    assert('Should have ramp (id = 11) data matching tiled export',
        doesObjectContain(ramp, {
            id: 11,
            name: 'ramp',
            type: '',
            x: 158,
            y: 462,
            visible: true,
            rotation: 0
        })
    );
    assert('Should have ramp (id = 11) with 7 polyline points',
        ramp.polyline.length === 7
    );
    assert('Should have ramp (id = 11) with polyline points in object format',
        ramp.polyline[0].x !== undefined && ramp.polyline[0].y !== undefined
    );

    var poly = map.findObject('Object Layer 1', obj => obj.id === 19);
    assert('Should contain object at id 19',
        poly
    );
    assert('Should have poly (id = 19) data matching tiled export',
        doesObjectContain(poly, {
            id: 19,
            name: 'poly',
            type: '',
            x: 784,
            y: 128,
            visible: true,
            rotation: 45
        })
    );
    assert('Should have poly (id = 19) with 4 polygon points',
        poly.polygon.length === 4
    );
    assert('Should have poly (id = 19) with polygon points in array format',
        poly.polygon[0].x !== undefined && poly.polygon[0].y !== undefined
    );

    var text = map.findObject('Object Layer 1', obj => obj.id === 20);
    assert('Should contain object at id 20',
        text
    );
    assert('Should have text (id = 20) data matching tiled export',
        doesObjectContain(text, {
            id: 20,
            name: 'text',
            type: '',
            x: 624,
            y: 56,
            width: 200,
            height: 50,
            rotation: 0,
            visible: true
        })
    );
    assert('Should have text (id = 20) with style from Tiled',
        doesObjectContain(text.text, {
            color: '#ffffff',
            fontfamily: 'Montserrat',
            halign: 'center',
            valign: 'center',
            pixelsize: 21,
            wrap: true
        })
    );

    // -- TILE DATA (E.G. COLLISION OBJECTS) ---

    var treeTileset = map.tilesets[map.getTilesetIndex('walls_1x2')];

    assert('Should contain walls_1x2 tileset',
        treeTileset
    );
    var tileData = treeTileset.tileData;
    var tileKeys = Object.keys(treeTileset.tileData);
    assert('Should contain tile data for each tile in tileset',
        tileKeys.length === 8
    );
    assert('Should contain object data for each tile in tileset',
        tileKeys.filter((k) => tileData[k].objectgroup).length === 8
    );
    assert('Tree 1 object layer data should match Tiled export',
        doesObjectContain(tileData['0'].objectgroup, {
            name: 'Tree 1',
            visible: true,
            opacity: 0.5
        })
    );
    assert('Tree 1 object layer data should have 2 rectangle objects',
        doesObjectContain(tileData['0'].objectgroup, {
            objects: [
                { rectangle: true },
                { rectangle: true }
            ]
        })
    );
    assert('Tree 2 object layer data should have 1 polyline object',
        doesObjectContain(tileData['1'].objectgroup, {
            name: 'Tree 2',
            objects: [
                { polyline: [] }
            ]
        })
    );
    assert('Tree 3 object layer data should have 1 ellipse and 1 rectangle',
        doesObjectContain(tileData['2'].objectgroup, {
            name: 'Tree 3',
            objects: [
                { ellipse: true },
                { rectangle: true }
            ]
        })
    );
    assert('Tree 8 object layer data should have 1 rectangle and 1 polygon',
        doesObjectContain(tileData['7'].objectgroup, {
            name: 'Tree 8',
            objects: [
                { rectangle: true },
                { polygon: [] }
            ]
        })
    );
    assert('Tileset should return tile data via GID',
        doesObjectContain(treeTileset.getTileData(26), {
            objectgroup: { name: 'Tree 1' }
        })
    );
    assert('Tileset should not return tile data for an GID that is out of range',
        treeTileset.getTileData(25) === null
    );

    // -- IMAGE COLLECTIONS ---

    assert('Map should have 4 images in first image collection',
        map.imageCollections[0].images.length === 4
    );

    // -- OFFSETS ---

    assert('Offset Tile Layer should be at (64, 32) via offset',
        map.getLayer('Offset Tile Layer').x === 64 &&
        map.getLayer('Offset Tile Layer').y === 32
    );
    assert('Tile Layer 2 should have no offset',
        map.getLayer('Tile Layer 2').x === 0 &&
        map.getLayer('Tile Layer 2').y === 0
    );
    assert('Offset Object Layer should have a circle at (606, 412) via offset',
        map.getObjectLayer('Offset Object Layer').objects[0].x === 606 &&
        map.getObjectLayer('Offset Object Layer').objects[0].y === 412
    );

    // -- IMAGE LAYER ---

    assert('Image Layer 1 should exist', map.getImageIndex('Image Layer 1') !== null);

    var imageLayer = map.images[map.getImageIndex('Image Layer 1')];
    assert('Image Layer 1 should have custom properties',
        imageLayer.properties.alpha === 0.8 && imageLayer.properties.x === 300
    );
}

// Helper that (shallowly) checks if two arrays are equal
function are1DArrayEqual(array1, array2)
{
    if (array1.length !== array2.length) return false;
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

// Helper that (recursively) checks if obj1 contains all the properties that obj2 has
function doesObjectContain (obj1, obj2) {
    const debug = () => console.log(
        `Objects don't match:\n${JSON.stringify(obj1, null, 2)}\n${JSON.stringify(obj2, null, 2)}`
    );
    if (typeof obj1 !== typeof obj2 || typeof obj1 !== 'object') {
        debug();
        return false;
    }
    for (const key of Object.keys(obj2)) {
        var v1 = obj1[key];
        var v2 = obj2[key];
        if (typeof v1 !== typeof v2) {
            debug();
            return false;
        }
        else if (typeof v1 === 'object') {
            if (!doesObjectContain(v1, v2)) {
                debug();
                return false;
            }
        }
        else if (v1 !== v2) {
            debug();
            return false;
        }
    }
    return true;
}
