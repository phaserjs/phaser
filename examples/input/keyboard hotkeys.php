<?php
    $title = "Keyboard Hotkeys";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.image('phaser', 'assets/sprites/phaser-dude.png');
        game.load.image('logo', 'assets/sprites/phaser_tiny.png');
        game.load.image('pineapple', 'assets/sprites/pineapple.png');

    }

    var key1;
    var key2;
    var key3;

    function create() {

        game.stage.backgroundColor = '#736357';

        //  Here we create 3 hotkeys, keys 1-3 and bind them all to their own functions

        key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        key1.onDown.add(addPhaserDude, this);

        key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        key2.onDown.add(addPhaserLogo, this);

        key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        key3.onDown.add(addPineapple, this);

    }

    function addPhaserDude () {
        game.add.sprite(game.world.randomX, game.world.randomY, 'phaser');
    }

    function addPhaserLogo () {
        game.add.sprite(game.world.randomX, game.world.randomY, 'logo');
    }

    function addPineapple () {
        game.add.sprite(game.world.randomX, game.world.randomY, 'pineapple');
    }


</script>

<?php
    require('../foot.php');
?>