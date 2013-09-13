<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - Super Mario Combo</title>
    <script src="phaser-min.js"></script>
    <style type="text/css">
        body: {
            margin: 0;
        }
    </style>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('nes', 'gfx/mario1.png', 'gfx/mario1.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('snes', 'gfx/smb_tiles.png', 'gfx/smb_level1.json', null, Phaser.Tilemap.JSON);

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

</body>
</html>