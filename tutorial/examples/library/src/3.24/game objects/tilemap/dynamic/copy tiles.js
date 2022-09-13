var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
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
var sourceMarker;
var destinationMarker;
var map;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('Desert', 'tiles');
    var layer = map.createDynamicLayer('Ground', tiles, 0, 0);

    // Graphic to show the "source" of the copy operation
    sourceMarker = this.add.graphics({ lineStyle: { width: 5, color: 0xffffff, alpha: 1 } });
    sourceMarker.strokeRect(0, 0, 6 * map.tileWidth, 6 * map.tileHeight);

    // Graphic to show the "destination" of the copy operation
    destinationMarker = this.add.graphics({ lineStyle: { width: 5, color: 0x000000, alpha: 1 } });
    destinationMarker.strokeRect(0, 0, 6 * map.tileWidth, 6 * map.tileHeight);
    destinationMarker.setPosition(map.tileWidth * 5, map.tileHeight * 10);

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

    var help = this.add.text(16, 16, 'Left-click to copy the tiles in the\nwhite rectangle to the black rectangle.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    var sourceTileX = map.worldToTileX(worldPoint.x);
    var sourceTileY = map.worldToTileY(worldPoint.y);
    var destinationTileX = map.worldToTileX(destinationMarker.x);
    var destinationTileY = map.worldToTileY(destinationMarker.y);

    // Snap to tile coordinates, but in world space
    sourceMarker.x = map.tileToWorldX(sourceTileX);
    sourceMarker.y = map.tileToWorldY(sourceTileY);

    if (this.input.manager.activePointer.isDown)
    {
        // Copy a 6 x 6 area at (sourceTileX, sourceTileY) to (destinationTileX, destinationTileY)
        map.copy(sourceTileX, sourceTileY, 6, 6, destinationTileX, destinationTileY);
    }

}
