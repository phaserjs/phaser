var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'impact',
        impact: { gravity: 200 }
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
    this.load.image('tiles', 'assets/tilemaps/tiles/slopes32mud.png');
    this.load.image('player', 'assets/sprites/phaser-dude.png');

    // A standard Weltmeister map with two layers: "map" & "collision"
    this.load.tilemapImpact('map', 'assets/tilemaps/maps/impact3.json');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });

    // Name of tileset from Weltmeister map, name of image in Phaser cache
    var tileset = map.addTilesetImage('media/tiles.png', 'tiles');

    map.createBlankDynamicLayer('background', tileset)
        .fill(0)
        .setAlpha(0.3);

    // Name of layer from Weltmeister, tileset, x, y
    var layer = map.createStaticLayer('map', tileset, 0, 0);

    // This will pull in the "collision" layer from the associated map
    this.impact.world.setCollisionMap('map');

    player = this.impact.add.image(64, 300, 'player');
    player.setMaxVelocity(500, 400).setFriction(800, 0);
    player.body.accelGround = 1200;
    player.body.accelAir = 600;
    player.body.jumpSpeed = 1000;

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    cursors = this.input.keyboard.createCursorKeys();

    var help = this.add.text(16, 16, 'Arrow keys to move. Press "up" to jump.', {
        fontSize: '18px',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    var accel = player.body.standing ? player.body.accelGround : player.body.accelAir;

    if (cursors.left.isDown)
    {
        player.setAccelerationX(-accel);
    }
    else if (cursors.right.isDown)
    {
        player.setAccelerationX(accel);
    }
    else
    {
        player.setAccelerationX(0);
    }

    if (cursors.up.isDown && player.body.standing)
    {
        player.setVelocityY(-player.body.jumpSpeed);
    }
}
