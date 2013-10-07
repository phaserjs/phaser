<?php
    $title = "Test Title";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('mario', 'assets/maps/mario1.png', 'assets/maps/mario1.json', null, Phaser.Tilemap.JSON);
        game.load.image('player', 'assets/sprites/phaser-dude.png');

    }

    var map;
    var p;

    function create() {

        game.stage.backgroundColor = '#787878';

        map = game.add.tilemap(0, 0, 'mario');

        //  floor
        map.setCollisionRange(80, 97, true, true, true, true);

        //  one-ways
        map.setCollisionRange(15, 17, true, true, false, true);

        p = game.add.sprite(32, 32, 'player');

        p.body.bounce.y = 0.4;
        p.body.collideWorldBounds = true;

        game.camera.follow(p);

    }

    function update() {

        map.collide(p);

        p.body.velocity.x = 0;
        p.body.acceleration.y = 500;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            p.body.velocity.x = -150;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            p.body.velocity.x = 150;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            if (p.body.touching.down)
            {
                p.body.velocity.y = -200;
            }
        }

    }

    function render() {

        game.debug.renderSpriteCorners(p);
        game.debug.renderSpriteCollision(p, 32, 320);

    }


</script>

<?php
    require('../foot.php');
?>