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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        //  Lots of assets
        game.load.image('stars', 'assets/misc/starfield.jpg');
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');

    }

    var camSpeed = 8;
    var s;

    function create() {

        //  Make our world big ...
        game.world.setSize(4000, 2000);

        //  Scrolling background
        s = game.add.tileSprite(0, 0, 800, 600, 'stars');
        s.scrollFactor.setTo(0, 0);

        //  Now let's create loads of stuff moving around it
        for (var i = 0; i < 50; i++)
        {
            var temp = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
            temp.body.velocity.setTo(50 + Math.random() * 90, 50 + Math.random() * 90);
            temp.body.bounce.setTo(1, 1);
            temp.body.collideWorldBounds = true;

            var temp = game.add.sprite(game.world.randomX, game.world.randomY, 'atari1');
            temp.body.velocity.setTo(10 + Math.random() * 90, 10 + Math.random() * 90);
            temp.body.bounce.setTo(1, 1);
            temp.body.collideWorldBounds = true;
        }

    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= camSpeed;

            if (!game.camera.atLimit.x)
            {
                s.tilePosition.x += camSpeed;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += camSpeed;

            if (!game.camera.atLimit.x)
            {
                s.tilePosition.x -= camSpeed;
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= camSpeed;

            if (!game.camera.atLimit.y)
            {
                s.tilePosition.y += camSpeed;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += camSpeed;

            if (!game.camera.atLimit.y)
            {
                s.tilePosition.y -= camSpeed;
            }
        }

    }

    function render() {

        game.debug.renderCameraInfo(game.camera, 32, 32);

    }

})();
</script>

</body>
</html>