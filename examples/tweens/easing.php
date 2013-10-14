<?php
    $title = "Using duration and scale";
    require('../head.php');
?>

<script type="text/javascript">

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 138, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        
    }
    function create() {
        var item,
            shadow,
            tween;

        // Sets background color to white.
        game.stage.backgroundColor = '#fff';

        for (var i = 0; i < 6; i++) {
            // Add a shadow to the location which characters will land on.
            // And tween their size to make them look like a real shadow.
            // Put the following code before items to give shadow a lower
            // render order.
            shadow = game.add.sprite(190 + 69 * i, 284, 'shadow');
            // Set shadow's size 0 so that it'll be invisible at the beginning.
            shadow.scale.setTo(0.0, 0.0);
            // Also set the origin to the center since we don't want to
            // see the shadow scale to the left top.
            shadow.anchor.setTo(0.5, 0.5);
            game.add.tween(shadow.scale)
                .to({x: 1.0, y: 1.0}, 2400, Phaser.Easing.Bounce.Out);

            // Add characters on top of shadows.
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            // Set origin to the center to make the rotation look better.
            item.anchor.setTo(0.5, 0.5);
            // Add a simple bounce tween to each character's position.
            tween = game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out);
        }



        }

</script>

<?php
    require('../foot.php');
?>