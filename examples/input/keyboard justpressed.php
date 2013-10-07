<?php
    $title = "Keyboard justPressed";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var phaser;

    function preload() {

        game.load.image('phaser', 'assets/sprites/phaser-dude.png');

    }

    function create() {

        game.stage.backgroundColor = '#736357';

        phaser = game.add.sprite(300, 300, 'phaser');

    }

    function update() {

        if (game.input.keyboard.justPressed(Phaser.Keyboard.UP))
        {
            phaser.y--;
        }

        if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN))
        {
            phaser.y++;
        }

    }


</script>

<?php
    require('../foot.php');
?>