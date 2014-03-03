
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/games/starstruck/tiles-1.png', 16, 16);
    game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/games/starstruck/star.png');
    game.load.image('starBig', 'assets/games/starstruck/star2.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    tileset = game.add.tileset('tiles');

    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    tileset.setCollisionRange(12, 16, false, false, false, false);
    tileset.setCollisionRange(46, 50, false, false, false, false);

    layer = game.add.tilemapLayer(0, 0, 800, 600, tileset, map, 0);
    layer.resizeWorld();

    player = game.add.sprite(32, 32, 'dude');
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 6;
    player.body.setSize(16, 32, 8, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.angle = 45;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    game.physics.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    // player.scale.x += 0.001;
    // player.scale.y += 0.001;

}

function render () {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteBody(player);

}
