<?php
    $title = "Tweening several properties";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload:preload,create: create });


    function preload() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 68, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        
    }
    function create() {

        game.stage.backgroundColor='#ffffff';
        var item;
        for (var i = 0; i < 6; i++) {
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            item.anchor.setTo(0.5,0.5);
            // Add a simple bounce tween to each character's position.
            game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
            // Add another rotation tween to the same character.
            game.add.tween(item)
                .to({rotation: 360}, 2400, Phaser.Easing.Cubic.In, true, 1000 + 400 * i, false);
        }
    }



</script>

<?php
    require('../foot.php');
?>