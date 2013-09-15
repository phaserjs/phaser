<?php
    $title = "Star Struck";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

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
        bg.scrollFactor.setTo(0, 0);

        map = game.add.tilemap(0, 0, 'level1');
        map.setCollisionRange(1, 12, true, true, true, true);
        map.setCollisionRange(18, 47, true, true, true, true);
        map.setCollisionRange(53, 69, true, true, true, true);

        player = game.add.sprite(32, 32, 'dude');
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(player);

    }

    function update() {

        game.physics.collide(player, map);

        player.body.velocity.x = 0;
        player.body.acceleration.y = 500;

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
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            if (player.body.touching.down && game.time.now > jumpTimer)
            {
                player.body.velocity.y = -200;
                jumpTimer = game.time.now + 500;
            }
        }

    }

    function render() {

        // game.debug.renderSpriteCorners(p);
        // game.debug.renderSpriteCollision(p, 32, 320);
        // game.debug.renderText(player.body.velocity.y, 32, 32, 'rgb(255,255,255)');
        // game.debug.renderText('left: ' + player.body.touching.left, 32, 32, 'rgb(255,255,255)');
        // game.debug.renderText('right: ' + player.body.touching.right, 32, 64, 'rgb(255,255,255)');

    }

})();
</script>

<?php
    require('../foot.php');
?>