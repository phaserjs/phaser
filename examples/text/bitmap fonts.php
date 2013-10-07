<?php
    $title = "Bitmap Fonts ahoy";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {

        game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

    }

    var text;

    function create() {

        text = game.add.bitmapText(200, 100, 'Phaser & Pixi\nrocking!', { font: '64px Desyrel', align: 'center' });

    }

    function update() {

        text.setText('Phaser & Pixi\nrocking!\n' + Math.round(game.time.now));

    }


</script>

<?php
    require('../foot.php');
?>