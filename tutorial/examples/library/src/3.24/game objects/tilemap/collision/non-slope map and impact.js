var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'impact',
        impact: { gravity: 0 }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv');
    this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });
}

function create ()
{
    // When loading a CSV map, make sure to specify the tileWidth and tileHeight
    var map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
    var tileset = map.addTilesetImage('tiles');
    var layer = map.createStaticLayer(0, tileset, 0, 0);

    // This isn't totally accurate, but it'll do for now
    layer.setCollisionBetween(54, 83);

    // If we don't have slopes in our map, we can simply specify what the default colliding tile's
    // slope ID should be. In this case, it would just be the ID for a solid rectangle, 1.
    this.impact.world.setCollisionMapFromTilemapLayer(layer, { defaultCollidingSlope: 1 });

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

    player = this.impact.add.sprite(50, 100, 'player', 1);
    player.setMaxVelocity(300, 400);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    cursors = this.input.keyboard.createCursorKeys();

    var help = this.add.text(16, 16, 'Arrow keys to move.', {
        fontSize: '18px',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    player.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-100);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown)
    {
        player.setVelocityY(-100);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(100);
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
