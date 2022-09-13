var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;
var game = new Phaser.Game(config);
var map;
var debugGraphics;

function preload ()
{
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tileset-collision-property.json');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tileset-collision-property-v12.json');
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenny_platformer_64x64');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);
    layer.setScale(0.75);

    // Instead of setting collision by index, you can set collision via properties that you set up
    // in Tiled. You can assign properties to tiles in the tileset editor. Note: you need
    // to NOT have the collision editor or terrain editor open when you set them up.
    // This map has tiles with a boolean "collides" property, so we can do the following:
    layer.setCollisionByProperty({ collides: true });

    // You can also specify multiple properties, or an array of possible property values. The next
    // line would set any tile to collide if it has "collides" set to true or if it has a "type"
    // equal to 'lava' or 'water':
    // layer.setCollisionByProperty({ collides: true, type: [ 'lava', 'water' ] });

    // Visualize the colliding tiles
    debugGraphics = this.add.graphics();
    drawDebug();

    this.input.on('pointerdown', function ()
    {
        debugGraphics.visible = !debugGraphics.visible;
        if (debugGraphics.visible)
        {
            drawDebug();
        }
    });

    var help = this.add.text(16, 16, 'Click to toggle rendering collision information.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);

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

function drawDebug ()
{
    debugGraphics.clear();
    map.renderDebug(debugGraphics, { tileColor: null });
}
