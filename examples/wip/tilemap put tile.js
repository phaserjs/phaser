
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');

}

var map;
var layer;

var marker;
var currentTile = 0;
var cursors;

function create() {

    game.stage.backgroundColor = '#787878';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Creates a layer and sets-up the map dimensions.
    //  In this case the map is 30x30 tiles in size and the tiles are 32x32 pixels in size.
    map.create('level1', 30, 30, 32, 32);

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');
    
    //  Create a layer. This is where the map is rendered to.
    layer = map.createLayer('level1');

    //  Resize the world
    layer.resizeWorld();

    map.setCollisionBetween(0, 12);

    layer.debug = true;

    //  Create our tile selector at the top of the screen
    createTileSelector();

    game.input.setMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

}

function pickTile(sprite, pointer) {

    currentTile = game.math.snapToFloor(pointer.x, 32) / 32;

}

function updateMarker() {

    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y))
    }

}

function update() {

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

}

function render() {

}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}