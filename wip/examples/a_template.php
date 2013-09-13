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

        game.load.image('atari1', 'assets/sprites/atari130xe.png');

    }

    function create() {

        // var tempSprite = game.add.sprite(game.world.randomX, game.world.randomY, 'atari1');

    }

    function update() {
    }

    function render() {
    }

})();
</script>

</body>
</html>