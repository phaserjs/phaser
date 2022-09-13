var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var cursors;
var debugGraphics;
var helpText;
var player;
var showDebug = false;
var currentTileset = 1;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    this.load.image('tiles_red', 'assets/tilemaps/tiles/catastrophi_tiles_16_red.png');
    this.load.image('tiles_blue', 'assets/tilemaps/tiles/catastrophi_tiles_16_blue.png');
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv');
    this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });
}

function create ()
{
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight
    map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    var tileset = map.addTilesetImage('tiles_red');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);
    layer.setScale(2);

    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);

    this.input.keyboard.on('keydown_ONE', function (event) {
        var texture = this.sys.textures.get('tiles_red');
        currentTileset = 1;
        tileset.setImage(texture);
        updateHelpText();
    }, this);

    this.input.keyboard.on('keydown_TWO', function (event) {
        var texture = this.sys.textures.get('tiles_blue');
        currentTileset = 2;
        tileset.setImage(texture);
        updateHelpText();
    }, this);

    this.input.keyboard.on('keydown_THREE', function (event) {
        var texture = this.sys.textures.get('tiles');
        currentTileset = 3;
        tileset.setImage(texture);
        updateHelpText();
    }, this);


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    player = this.physics.add.sprite(100, 100, 'player', 1)
        .setScale(2);
    player.setSize(10, 10, false);

    // Set up the player to collide with the tilemap layer. Alternatively, you can manually run
    // collisions in update via: this.physics.world.collide(player, layer).
    this.physics.add.collider(player, layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    debugGraphics = this.add.graphics();

    this.input.keyboard.on('down_67', function (event)
    {
        showDebug = !showDebug;
        drawDebug();
    });

    cursors = this.input.keyboard.createCursorKeys();

    helpText = this.add.text(16, 16, '', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    helpText.setScrollFactor(0);
    updateHelpText();
}

function update (time, delta)
{
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-200);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(200);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown)
    {
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.anims.play('down', true);
    }
    else
    {
        player.anims.stop();
    }
}

function drawDebug ()
{
    debugGraphics.clear();

    if (showDebug)
    {
        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    }

    updateHelpText();
}

function updateHelpText ()
{
    helpText.setText(
        'Arrow keys to move.' +
        '\nPress 1/2/3 to change the tileset texture.' +
        '\nCurrent texture: ' + currentTileset
    );
}
