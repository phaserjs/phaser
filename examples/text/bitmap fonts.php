<?php
    $title = "Bitmap Fonts ahoy";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

    }

    function create() {

        game.add.bitmapText(200, 100, 'Phaser & Pixi\nrocking!', { font: '64px Desyrel', align: 'center' });

    }

})();
</script>

<?php
    require('../foot.php');
?>