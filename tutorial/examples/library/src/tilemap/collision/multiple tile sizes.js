var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 576,
    backgroundColor: '#00000',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 400 }, debug: true }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var tree32x64Layer;
var ground32x32Layer;
var kenny64x64Layer;
var text;
var cursors;
var debugGraphics;
var player;
var showDebug;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/multiple-tile-sizes-collision.json');

    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
    this.load.image('dangerous-kiss', 'assets/tilemaps/tiles/dangerous-kiss.png');

    this.load.image('player', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    map = this.add.tilemap('map');

    var groundTiles = map.addTilesetImage('ground_1x1', 'ground_1x1', 32, 32);
    var kennyTiles = map.addTilesetImage('kenny_platformer_64x64', 'kenny_platformer_64x64', 64, 64);
    var treeTiles = map.addTilesetImage('walls_1x2', 'walls_1x2', 32, 64);

    kenny64x64Layer = map.createLayer('Kenny 64x64 Layer', kennyTiles);
    ground32x32Layer = map.createLayer('Ground 32x32 Layer', groundTiles);
    tree32x64Layer = map.createLayer('Tree 32x64 Layer', treeTiles);

    console.log(kenny64x64Layer);

    ground32x32Layer.setCollisionByExclusion([ -1 ]);
    tree32x64Layer.setCollisionByExclusion([ -1 ]);
    kenny64x64Layer.setCollision([ 73 ]);

    player = this.physics.add.sprite(500, 300, 'player').setBounce(0.1);

    this.physics.add.collider(player, ground32x32Layer);
    this.physics.add.collider(player, kenny64x64Layer);
    this.physics.add.collider(player, tree32x64Layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    debugGraphics = this.add.graphics();

    this.input.keyboard.on('keydown-C', function (event) {
        showDebug = !showDebug;
        drawDebug();
    });

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(16, 16, '', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
    updateText();
}

function update (time, delta)
{
    // Horizontal movement
    player.body.setVelocityX(0);
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
    }

    // Jumping
    if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor())
    {
        player.body.setVelocityY(-300);
    }
}

function drawDebug ()
{
    debugGraphics.clear();

    if (showDebug)
    {
        ground32x32Layer.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(211, 36, 255, 100), // Colliding tiles
            faceColor: new Phaser.Display.Color(211, 36, 255, 255) // Colliding face edges
        });

        kenny64x64Layer.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(244, 255, 36, 100), // Colliding tiles
            faceColor: new Phaser.Display.Color(244, 255, 36, 255) // Colliding face edges
        });

        tree32x64Layer.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(36, 255, 237, 100), // Colliding tiles
            faceColor: new Phaser.Display.Color(36, 255, 237, 255) // Colliding face edges
        });
    }

    updateText();
}

function updateText ()
{
    text.setText(
        'Arrow keys to move. Space to jump' +
        '\nPress "C" to toggle debug visuals: ' + (showDebug ? 'on' : 'off')
    );
}
