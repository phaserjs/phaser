var config = {
    width: 800,
    height: 600,
    type: Phaser.CANVAS,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            minimap: null
        }
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/drawtiles.png');
}

function create ()
{
    var width = 40 * 2;
    var height = 38 * 2;

    var level = [];

    for (var y = 0; y < height; y++)
    {
        var row = [];

        for (var x = 0; x < width; x++)
        {
            var index = Phaser.Math.RND.between(0, 5);

            if (y === 0 || y === height - 1 || x === 0 || x === width - 1)
            {
                index = 6;
            }

            row.push(index);
        }

        level.push(row);
    }

    var map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
    var tileset = map.addTilesetImage('tiles');

    var layer = map.createStaticLayer(0, tileset, 0, 0);

    // layer.setScale(0.5);
    // layer.skipCull = true;
    // var layer = map.createDynamicLayer(0, tileset, 0, 0);

    this.cameras.main.setBackgroundColor(0xff0000);
    this.cameras.main.setZoom(0.5);
    this.cameras.main.setBounds(0, 0, layer.width, layer.height);
    // this.cameras.main.setAngle(20);
    // this.cameras.main.setViewport(100, 100, 600, 400);

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
