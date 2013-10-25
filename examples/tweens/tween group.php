<?php
    $title = "Chained Tweens";
    require('../head.php');
?>

<script type="text/javascript">

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    var diamond, carrot, wabbit, ufo;

    var group;

    function preload() {

        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.image('carrot', 'assets/sprites/carrot.png');
        game.load.image('wabbit', 'assets/sprites/wabbit.png');
        game.load.image('ufo', 'assets/sprites/ufo.png');

        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    }

    function create() {

        game.stage.backgroundColor = 0x2d2d2d;

        diamond = game.add.sprite(50, 50, 'diamond');
        carrot = game.add.sprite(100, 50, 'carrot');
        wabbit = game.add.sprite(150, 50, 'wabbit');
        ufo = game.add.sprite(200, 50, 'ufo');

        group = game.add.tweenGroup(0, Infinity, true).to(p, { x: 100 }, 1000, Phaser.Easing.Linear.None, false, 500);
        group.to(p, { y: 100 }, 1000, Phaser.Easing.Linear.None, false, 500);
        group.to(p, { x: 50 }, 1000, Phaser.Easing.Linear.None, false, 500);
        group.to(p, { y: 50 }, 1000, Phaser.Easing.Linear.None, false, 500);

        button = game.add.button(game.world.centerX, 400, 'button', actionOnClick, this, 2, 1, 0);
    }

    function actionOnClick() {

        if (flag) {
            console.log('started');
            group.resume();
        }
        else {
            console.log('stopped');
            group.pause();
        }

        flag = !flag;

    }

</script>

<?php
    require('../foot.php');
?>