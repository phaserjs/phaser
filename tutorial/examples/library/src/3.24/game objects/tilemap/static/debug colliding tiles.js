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
var debugGraphics;
var game = new Phaser.Game(config);
var map;
var helpText;
var showTiles = true;
var showFaces = true;
var showCollidingTiles = true;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/super-mario.json');
    this.load.image('SuperMarioBros-World1-1', 'assets/tilemaps/tiles/super-mario.png');
    this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('SuperMarioBros-World1-1');
    var layer = map.createStaticLayer('World1', tileset, 0, 0);
    layer.setScale(2);

    map.setCollision([ 14, 15, 16, 20, 21, 22, 23, 24, 25, 27, 28, 29, 33, 39, 40 ]);

    debugGraphics = this.add.graphics();
    debugGraphics.setScale(2);

    this.input.keyboard.on('keydown_ONE', function (event) {
        showTiles = !showTiles;
        drawDebug();
    });

    this.input.keyboard.on('keydown_TWO', function (event) {
        showCollidingTiles = !showCollidingTiles;
        drawDebug();
    });

    this.input.keyboard.on('keydown_THREE', function (event) {
        showFaces = !showFaces;
        drawDebug();
    });

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        speed: 0.5
    };

    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    helpText = this.add.text(16, 16, getHelpMessage(), {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    helpText.setScrollFactor(0);

    drawDebug();
}

function update (time, delta)
{
    controls.update(delta);
}

function drawDebug ()
{
    var tileColor = showTiles ? new Phaser.Display.Color(105, 210, 231, 200) : null;
    var colldingTileColor = showCollidingTiles ? new Phaser.Display.Color(243, 134, 48, 200) : null;
    var faceColor = showFaces ? new Phaser.Display.Color(40, 39, 37, 255) : null;

    debugGraphics.clear();

    // Pass in null for any of the style options to disable drawing that component
    map.renderDebug(debugGraphics, {
        tileColor: tileColor,                   // Non-colliding tiles
        collidingTileColor: colldingTileColor,  // Colliding tiles
        faceColor: faceColor                    // Interesting faces, i.e. colliding edges
    });

    helpText.setText(getHelpMessage());
}

function getHelpMessage ()
{
    return 'Press 1 to toggle tiles: ' + (showTiles ? 'on' : 'off') +
        '\nPress 2 to toggle colliding tiles: ' + (showCollidingTiles ? 'on' : 'off') +
        '\nPress 3 to toggle interesting faces: ' + (showFaces ? 'on' : 'off');
}

