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

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, render: render });

    function preload() {

        game.load.image('atari1', 'assets/sprites/atari130xe.png');

    }

    function create() {

        var tempSprite = game.add.sprite(0, 0, 'atari1');
        tempSprite.visible = false;

        var renderTexture = game.add.renderTexture('fuji', 320, 200);
        renderTexture.render(tempSprite);

        var texturedSprite = game.add.sprite(400, 300, renderTexture);

    }

    function render() {
    }

})();
</script>

</body>
</html>