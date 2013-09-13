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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.image('grid', 'assets/tests/debug-grid-1920x1920.png');
        game.load.image('atari', 'assets/sprites/atari800xl.png');

    }

    function create() {

        game.add.sprite(0, 0, 'grid');

        atari1 = game.add.sprite(300, 300, 'atari');

        //  Input Enable the sprites
        atari1.inputEnabled = true;

        //  Allow dragging
        //  enableDrag parameters = (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite)
        atari1.input.enableDrag(true);

    }

})();
</script>

</body>
</html>