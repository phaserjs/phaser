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

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        //  Lots of assets
        game.load.image('stars', 'assets/misc/starfield.jpg');
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');

    }

    var s;
    var p;

    function create() {

        //  Make our world big ...
        game.world.setSize(4000, 2000);

        //  Scrolling background
        s = game.add.tileSprite(0, 0, 800, 600, 'stars');
        s.scrollFactor.setTo(0, 0);

        //  Now let's create loads of stuff moving around it
        for (var i = 0; i < 250; i++)
        {
            var temp = game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
            temp.autoCull = true;
        }

        p = game.add.sprite(200, 200, 'atari1');
        p.body.velocity.setTo(200 + Math.random() * 100, 200 + Math.random() * 100);
        p.body.bounce.setTo(1, 1);
        p.body.collideWorldBounds = true;

        game.camera.follow(p);

    }

    function update() {

        if (!game.camera.atLimit.x)
        {
            s.tilePosition.x -= p.body.deltaX();
        }

        if (!game.camera.atLimit.y)
        {
            s.tilePosition.y -= p.body.deltaY();
        }

    }

    function render() {

        game.debug.renderCameraInfo(game.camera, 32, 32);
        game.debug.renderText('Sprites rendered: ' + game.world.currentRenderOrderID, 32, 100);

    }

})();
</script>

</body>
</html>