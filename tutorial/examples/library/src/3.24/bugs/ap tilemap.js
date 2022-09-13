var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
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
var layer;
var showDebug = false;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv');
    this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });
}

function create ()
{
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight
    map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    var tileset = map.addTilesetImage('tiles');
    layer = map.createStaticLayer(0, tileset, 0, 0);

    //  This isn't totally accurate, but it'll do for now
    map.setCollisionBetween(54, 83);

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

    player = this.physics.add.sprite(50, 100, 'player', 1);

    // Set up the player to collide with the tilemap layer. Alternatively, you can manually run
    // collisions in update via: this.physics.world.collide(player, layer).
    // this.physics.add.collider(player, layer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    debugGraphics = this.add.graphics();

    this.input.keyboard.on('keydown_C', function (event) {
        showDebug = !showDebug;
        drawDebug();
    });

    cursors = this.input.keyboard.createCursorKeys();

    helpText = this.add.text(16, 16, '', {
        fontSize: '18px',
        fill: '#ffffff'
    });
    helpText.setScrollFactor(0);

    player.body.onCollide = true;
    player.on('collide', function () { console.log('collided'); });

}

function update (time, delta)
{
    var c = this.physics.collide(player, layer);

    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-100);
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.body.setVelocityY(-100);
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(100);
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

    helpText.setText([c, player.body.deltaX(), player.body.deltaY(), this.physics.world.stepsLastFrame]);
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

    // helpText.setText([player.body.deltaX(), player.body.deltaY()]);
}
