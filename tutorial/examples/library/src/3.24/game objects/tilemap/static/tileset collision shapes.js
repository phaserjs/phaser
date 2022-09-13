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
var controls;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tileset-collision-shapes.json');
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
}

function create ()
{
    var map = this.add.tilemap('map');
    var tileset = map.addTilesetImage('kenny_platformer_64x64');
    var layer = map.createStaticLayer('Tile Layer 1', tileset);

    var graphics = this.add.graphics();

    // Loop over each tile and visualize its collision shape (if it has one)
    layer.forEachTile(function (tile)
    {
        var tileWorldPos = layer.tileToWorldXY(tile.x, tile.y);
        var collisionGroup = tileset.getTileCollisionGroup(tile.index);

        if (!collisionGroup || collisionGroup.objects.length === 0) { return; }

        // You can assign custom properties to the whole collision object layer (or even to
        // individual objects within the layer). Here, use a custom property to change the color of
        // the stroke.
        if (collisionGroup.properties && collisionGroup.properties.isInteractive)
        {
            graphics.lineStyle(5, 0x00ff00, 1);
        }
        else
        {
            graphics.lineStyle(5, 0x00ffff, 1);
        }

        // The group will have an array of objects - these are the individual collision shapes
        var objects = collisionGroup.objects;

        for (var i = 0; i < objects.length; i++)
        {
            var object = objects[i];
            var objectX = tileWorldPos.x + object.x;
            var objectY = tileWorldPos.y + object.y;

            // When objects are parsed by Phaser, they will be guaranteed to have one of the
            // following properties if they are a rectangle/ellipse/polygon/polyline.
            if (object.rectangle)
            {
                graphics.strokeRect(objectX, objectY, object.width, object.height);
            }
            else if (object.ellipse)
            {
                // Ellipses in Tiled have a top-left origin, while ellipses in Phaser have a center
                // origin
                graphics.strokeEllipse(
                    objectX + object.width / 2, objectY + object.height / 2,
                    object.width, object.height
                );
            }
            else if (object.polygon || object.polyline)
            {
                var originalPoints = object.polygon ? object.polygon : object.polyline;
                var points = [];
                for (var j = 0; j < originalPoints.length; j++)
                {
                    var point = originalPoints[j];
                    points.push({
                        x: objectX + point.x,
                        y: objectY + point.y
                    });
                }
                graphics.strokePoints(points);
            }
        }
    });

    var help = this.add.text(16, 16, 'Collision shapes, parsed from Tiled', {
        fontSize: '20px',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    help.setScrollFactor(0);

    this.cameras.main.setScroll(80, 110);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.04,
        drag: 0.0005,
        maxSpeed: 0.7
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
