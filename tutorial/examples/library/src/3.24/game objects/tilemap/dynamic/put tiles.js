var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#00000',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var marker;
var map;
var objectToPlace = 'platform';

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/platformer_tiles.png');
}

function create ()
{
    // Creating a blank tilemap with the specified dimensions
    map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 25, height: 20});

    var tiles = map.addTilesetImage('tiles');

    var layer = map.createBlankDynamicLayer('layer1', tiles);
    layer.setScale(2);

    // Add a simple scene with some random element
    layer.fill(58, 0, 13, 25, 1); // Surface of the water
    layer.fill(77, 0, 14, 25, 5); // Body of the water
    layer.randomize(0, 0, 25, 13, [ 44, 45, 46, 47, 48 ]); // Wall above the water

    this.input.keyboard.on('keydown_ONE', function (event) {
        objectToPlace = 'platform';
        helpText.setText(getHelpMessage());
    });

    this.input.keyboard.on('keydown_TWO', function (event) {
        objectToPlace = 'flower';
        helpText.setText(getHelpMessage());
    });

    this.input.keyboard.on('keydown_THREE', function (event) {
        objectToPlace = 'tiki';
        helpText.setText(getHelpMessage());
    });

    marker = this.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.strokeRect(0, 0, map.tileWidth * layer.scaleX, map.tileHeight * layer.scaleY);

    var helpText = this.add.text(16, 16, getHelpMessage(), {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        fill: '#ffffff',
        backgroundColor: '#000000'
    });
    helpText.setScrollFactor(0);
}

function update (time, delta)
{
    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(worldPoint.x);
    var pointerTileY = map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    marker.x = map.tileToWorldX(pointerTileX);
    marker.y = map.tileToWorldY(pointerTileY);

    if (this.input.manager.activePointer.isDown)
    {
        switch (objectToPlace) {
            case 'flower':
                // You can place an individal tile by index (or by passing in a Tile object)
                map.putTileAt(15, pointerTileX, pointerTileY);
                break;
            case 'platform':
                // You can place a row of tile indexes at a location
                map.putTilesAt([ 104, 105, 106, 107 ], pointerTileX, pointerTileY);
                break;
            case 'tiki':
                // You can also place a 2D array of tiles at a location
                map.putTilesAt([
                    [ 49, 50 ],
                    [ 51, 52 ]
                ], pointerTileX, pointerTileY);
                break;
            default:
                break;
        }
    }

}

function getHelpMessage ()
{
    return 'Press 1/2/3 to change object to place.' +
        '\nLeft click to place the tiles.' +
        '\nSelected object: ' + objectToPlace;
}

