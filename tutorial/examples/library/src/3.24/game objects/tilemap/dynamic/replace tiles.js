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

    var help = this.add.text(16, 16, 'Click a tile to replace all instances with a plant.', {
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

    if (this.input.manager.activePointer.isDown)
    {
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        var tile = map.getTileAtWorldXY(worldPoint.x, worldPoint.y);

        // This will replace all instances of the selected tile with a plant (tile id = 38).
        map.replaceByIndex(tile.index, 38);

        // You can also replace within a specific region (tileX, tileY, width, height):
        // map.replaceByIndex(tile.index, 38, 5, 5, 15, 15);
    }

}
