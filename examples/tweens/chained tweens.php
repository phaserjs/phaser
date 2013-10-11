<?php
    $title = "Chained Tweens";
    require('../head.php');
?>

<script type="text/javascript">

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    var p, tween, button, flag = false;

    function preload() {

        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    }

    function create() {

        game.stage.backgroundColor = 0x2d2d2d;

        p = game.add.sprite(100, 100, 'diamond');

        tween = game.add.tween(p).to({ x: 600 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
        .to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 100 }, 1000, Phaser.Easing.Linear.None)
        .loop()
        .start();

        button = game.add.button(game.world.centerX, 400, 'button', actionOnClick, this, 2, 1, 0);
    }

    function actionOnClick() {

        if (flag) {
            console.log('started');
            tween.start();
        }
        else {
            console.log('stopped');
            tween.stop();
        }

        flag = !flag;

    }

</script>

<?php
    require('../foot.php');
?>