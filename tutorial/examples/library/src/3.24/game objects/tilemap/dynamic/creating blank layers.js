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

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/tiles2.png');
}

function create ()
{
    // Creating a blank tilemap with the specified dimensions
    var map = this.make.tilemap({ tileWidth: 70, tileHeight: 70, width: 50, height: 50});

    var tiles = map.addTilesetImage('tiles');

    // Each layer needs to get a unique name
    var layer1 = map.createBlankDynamicLayer('layer1', tiles);

    // Fill the layer with random tile indexes (where -1 is an empty tile)
    layer1.randomize(0, 0, map.width, map.height, [ -1, 0, 12 ]);

    // Push layer1 back into the "background"
    layer1.setScale(0.75);
    layer1.setScrollFactor(0.5);
    layer1.setAlpha(0.5);

    var layer2 = map.createBlankDynamicLayer('layer2', tiles);
    layer2.randomize(0, 0, map.width, map.height, [ -1, 1 ]);

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

    var help = this.add.text(16, 16, 'Arrows to scroll.', {
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
}
