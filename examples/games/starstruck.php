<?php
    $title = "Star Struck";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('level1', 'assets/games/starstruck/tiles-1.png', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.JSON);
        game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
        game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
        game.load.image('starSmall', 'assets/games/starstruck/star.png');
        game.load.image('starBig', 'assets/games/starstruck/star2.png');
        game.load.image('background', 'assets/games/starstruck/background2.png');

    }

    var map;
    var player;
    var facing = 'left';
    var jumpTimer = 0;
    var bg;

    function create() {

        game.stage.backgroundColor = '#000000';

        bg = game.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;

        map = game.add.tilemap(0, 0, 'level1');
        map.setCollisionRange(1, 12, true, true, true, true);
        map.setCollisionRange(18, 47, true, true, true, true);
        map.setCollisionRange(53, 69, true, true, true, true);

        // player = game.add.sprite(32, 32, 'dude');
        player = game.add.sprite(250, 220, 'dude');
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        // player.body.gravity.y = 10;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(player);

    }

    function update() {

        game.physics.collide(player, map);

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        // player.body.acceleration.y = 500;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            player.body.velocity.x = -150;

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
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

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            player.body.velocity.y = -150;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            player.body.velocity.y = 150;
        }

        
        // if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        // {
        //     if (player.body.touching.down && game.time.now > jumpTimer)
        //     {
        //         player.body.velocity.y = -200;
        //         jumpTimer = game.time.now + 500;
        //     }
        // }

    }

    function render() {

        game.debug.renderSpriteInfo(player, 32, 32);
        game.debug.renderSpriteCorners(player, false, true);
        game.debug.renderSpriteCollision(player, 32, 320);

    }


</script>

<?php
    require('../foot.php');
?>