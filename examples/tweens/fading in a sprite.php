<?php
    $title = "Alpha fading a sprite";
    require('../head.php');
?>

<script type="text/javascript">

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {
        game.load.image('space', 'assets/misc/starfield.png', 138, 15);
        game.load.image('ball', 'assets/sprites/shinyball.png');
        
    }
    function create() {
      

        game.add.tileSprite(0,0,800,600,'space');

        var sprite=game.add.sprite(400,300,'ball');

        //Fade in a sprite :
        game.add.tween(sprite)
        .to({alpha : 0},1500,Phaser.Easing.Linear.None)
        .start();

    }


</script>

<?php
    require('../foot.php');
?>