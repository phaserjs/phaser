<?php
    $title = "Enabling pixel perfect hit detection";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('bunny', 'assets/sprites/bunny.png');

    }

    var b;

    function create() {

        b = game.add.sprite(game.world.centerX, game.world.centerY, 'bunny');
        b.anchor.setTo(0.5, 0.5);

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
        b.angle += 0.1;
    }

    function render() {

        game.debug.renderSpriteInputInfo(b, 32, 32);

    }


</script>

<?php
    require('../foot.php');
?>