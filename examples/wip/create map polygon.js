
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    // game.load.tilemap('map', 'assets/tilemaps/maps/platform.json', null, Phaser.Tilemap.TILED_JSON);
    // game.load.image('platformer_tiles', 'assets/tilemaps/tiles/platformer_tiles.png');

    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');


}

var map;
var layer;
var mapLayer;

var polys = [];
var tiles = [];
var idx = 0;
var group = [];

function create() {

    game.stage.backgroundColor = '#124184';

    // map = game.add.tilemap('map');
    // map.addTilesetImage('platformer_tiles');
    // map.setCollisionBetween(21, 53);
    // layer = map.createLayer('Tile Layer 1');
    // layer.debug = true;

    map = game.add.tilemap('map');
    map.addTilesetImage('ground_1x1');
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');
    map.setCollisionBetween(1, 12);
    layer = map.createLayer('Tile Layer 1');

    mapLayer = map.layers[0];

    tiles = getInterestingTiles();

    console.log('found',tiles.length,'interesting tiles');


        // group = [];

        // var tile = getFirstUnscanned();

        // console.log('starting from', tile);

        // floodFill(tile);

        // console.log('group collected, size', group.length);

        //  now scan the group
        // scanEdges();



    //  works great :)
    while (getScannedLeft() > 0) {

        // group = [];

        var tile = getFirstUnscanned();

        console.log('starting from', tile);

        floodFill(tile);

        console.log('group collected, size', group.length);

        console.log('remaining: ', getScannedLeft());

    }

}

function getFirstUnscanned() {

    for (var i = 0; i < tiles.length; i++)
    {
        if (!tiles[i].scanned)
        {
            return tiles[i];
        }
    }

}

function getScannedLeft() {

    var total = tiles.length;

    for (var i = 0; i < tiles.length; i++)
    {
        if (tiles[i].scanned)
        {
            total--;
        }
    }

    return total;

}

var current;

function scanEdges() {

    var points = [];

    var start = group[0];

    // special case for when group.length = 1 should go here



}

function scanTop(origin) {

}

function floodFill(origin) {

    if (origin.scanned === true)
    {
        return;
    }

    origin.scanned = true;

    group.push(origin);

    // console.log('ff origin', origin.x, origin.y);

    var west = map.getTileLeft(0, origin.x, origin.y);

    if (west && (west.faceTop || west.faceBottom || west.faceLeft || west.faceRight))
    {
        // console.log('west found', west);
        floodFill(west);
    }

    var east = map.getTileRight(0, origin.x, origin.y);

    if (east && (east.faceTop || east.faceBottom || east.faceLeft || east.faceRight))
    {
        // console.log('east found', east);
        floodFill(east);
    }

    var north = map.getTileAbove(0, origin.x, origin.y);

    if (north && (north.faceTop || north.faceBottom || north.faceLeft || north.faceRight))
    {
        // console.log('north found', north);
        floodFill(north);
    }

    var south = map.getTileBelow(0, origin.x, origin.y);

    if (south && (south.faceTop || south.faceBottom || south.faceLeft || south.faceRight))
    {
        // console.log('south found', south);
        floodFill(south);
    }

}

function getInterestingTiles() {

    var tiles = [];

    for (var y = 0, h = mapLayer.height; y < h; y++)
    {
        for (var x = 0, w = mapLayer.width; x < w; x++)
        {
            var tile = mapLayer.data[y][x];

            if (tile && (tile.faceTop || tile.faceBottom || tile.faceLeft || tile.faceRight))
            {
                //  reset the scanned status
                tile.scanned = false;
                tiles.push(tile);
            }
        }
    }

    return tiles;

}

function getTile() {

    for (var y = 0, h = mapLayer.height; y < h; y++)
    {
        for (var x = 0, w = mapLayer.width; x < w; x++)
        {
            var tile = mapLayer.data[y][x];

            if (tile && (tile.faceTop || tile.faceBottom || tile.faceLeft || tile.faceRight))
            {
                return tile;
            }
        }
    }

}

function update() {

 
}

function render() {

    if (group)
    {
        game.context.fillStyle = 'rgba(255,0,0,0.7)';

        for (var i = 0; i < group.length; i++)
        {
            game.context.fillRect(group[i].x * group[i].width, group[i].y * group[i].height, group[i].width, group[i].height);
        }
    }

}