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

        game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

    }

    var b;

    function create() {

        b = game.add.sprite(game.world.centerX, game.world.centerY, 'mummy');
        b.anchor.setTo(0.5, 0.5);
        b.scale.setTo(6, 6);
        b.animations.add('walk');
        b.animations.play('walk', 5, true);

        //  Listen for input events on this sprite
        b.inputEnabled = true;

        //  Check the pixel data of the sprite
        b.input.pixelPerfect = true;

        //  Enable the hand cursor
        b.input.useHandCursor = true;

        b.events.onInputOver.add(overSprite, this);
        b.events.onInputOut.add(outSprite, this);

    }

    function overSprite() {
        console.log('over');
    }

    function outSprite() {
        console.log('out');
    }

    function update() {
        // b.angle += 0.1;
    }

    function render() {

        game.debug.renderSpriteInputInfo(b, 32, 32);

    }

})();
</script>

</body>
</html>