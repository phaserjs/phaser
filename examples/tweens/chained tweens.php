<?php
    $title = "Chained Tweens";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    var p;

    function preload() {

        game.load.image('diamond', 'assets/sprites/diamond.png');

    }

    function create() {

        game.stage.backgroundColor = 0x2d2d2d;

        p = game.add.sprite(100, 100, 'diamond');

        game.add.tween(p).to({ x: 600 }, 2000, Phaser.Easing.Linear.None, true)
        .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
        .to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 100 }, 1000, Phaser.Easing.Linear.None)
        .loop();
    }


</script>

<?php
    require('../foot.php');
?>