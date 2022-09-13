var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade'
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
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

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

    player = this.physics.add.sprite(400, 300, 'player', 1);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    updatePlayer();
    updateMap();
}

function updateMap () {
    var origin = map.getTileAtWorldXY(player.x, player.y);

    map.forEachTile(function (tile) {
        var dist = Phaser.Math.Distance.Chebyshev(
            origin.x,
            origin.y,
            tile.x,
            tile.y
        );

        tile.setAlpha(1 - 0.1 * dist);
    });
}

function updatePlayer () {
    player.body.setVelocity(0);

    // 8 directions

    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
    }
    else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown) {
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown) {
        player.anims.play('down', true);
    }
    else {
        player.anims.stop();
    }
}
