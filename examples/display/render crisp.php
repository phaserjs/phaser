<?php
    $title = "Canvas Smoothing";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.image('boss', 'assets/misc/boss1.png');
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    }
    var boss,
    button;

    function create() {
        
        //  For browsers that support it, this keeps our pixel art looking crisp
        //Phaser.Canvas.setSmoothingEnabled(game.stage.canvas.context, false);

        boss = game.add.sprite(game.world.centerX, game.world.centerY, 'boss');
        boss.anchor.setTo(0.5, 0.5);
        //  Zoom in each time we press it
        button = game.add.button(32, 32, 'button', clickedIt, this, 2, 1, 0);
    }

    function clickedIt() {
        boss.scale.x += 0.5;
        boss.scale.y += 0.5;
    }

})();

</script>

<?php
    require('../foot.php');
?>

