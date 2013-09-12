<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
</head>
<body>

<script type="text/javascript">

(function () {

    // var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
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

        //  pipes
        // map.setCollisionRange(31, 32, true, true, true, true);
        // map.setCollisionRange(37, 38, true, true, true, true);
        // map.setCollisionRange(39, 40, true, true, true, true);
        // map.setCollisionRange(45, 46, true, true, true, true);
        // map.setCollisionRange(73, 74, true, true, true, true);

        //  one-ways
        map.setCollisionRange(15, 17, true, true, false, true);

        p = game.add.sprite(0, 0, 'player');
        // p.body.velocity.y = 150;
        // p.body.gravity.y = 10;
        // p.body.bounce.y = 0.5;

    }

    function update() {

        map.collide(p);

        p.body.velocity.x = 0;
        p.body.acceleration.y = 250;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            p.body.velocity.x = -150;
            // game.camera.x -= 8;
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

})();
</script>

</body>
</html>