<?php
    $title = "Test Title";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.tilemap('nes', 'assets/maps/mario1.png', 'assets/maps/mario1.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('snes', 'assets/maps/smb_tiles.png', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.JSON);

    }

    function create() {

        game.stage.backgroundColor = '#5c94fc';

        game.add.tilemap(0, 0, 'nes');
        game.add.tilemap(0, 168, 'snes');

        game.add.tween(game.camera).to( { x: 5120-800 }, 30000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        game.input.onDown.add(goFull, this);

    }

    function goFull() {
        game.stage.scale.startFullScreen();
    }

})();
</script>

<?php
    require('../foot.php');
?>