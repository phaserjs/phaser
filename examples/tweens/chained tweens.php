<?php
    $title = "Chained Tweens";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var p;
    var p2;

    function preload() {

        game.load.image('diamond', 'assets/sprites/diamond.png');

    }

    function create() {

        game.stage.backgroundColor = 0x337799;

        p = game.add.sprite(0, 0, 'diamond');

        game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
        .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
        .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
        .to({ y: 0 }, 1000, Phaser.Easing.Linear.None);
    }

    function update() {

        // p.y = game.math.min(100, game.input.y);

    }

    function render() {
    }

})();
</script>

<?php
    require('../foot.php');
?>