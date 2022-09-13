var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var marker;
var propertiesText;

function preload ()
{
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile_properties-v12.json');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile_properties.json');
    this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);

    marker = this.add.graphics();
    marker.lineStyle(3, 0xffffff, 1);
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    var help = this.add.text(16, 500, 'Click on a tile to view its properties.', {
        font: '20px Arial',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);

    propertiesText = this.add.text(16, 540, 'Properties: ', {
        fontSize: '18px',
        fill: '#ffffff'
    });
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
        var tile = map.getTileAt(pointerTileX, pointerTileY);

        if (tile)
        {
            // Note: JSON.stringify will convert the object tile properties to a string
            propertiesText.setText('Properties: ' + JSON.stringify(tile.properties));
            tile.properties.viewed = true;
        }
    }
}
