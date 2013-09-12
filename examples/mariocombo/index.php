<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8" />
    <title>phaser.js - Super Mario Combo</title>
    <script src="phaser-min.js"></script>
    <style type="text/css">
        body {
            margin: 0;
            font-family: sans-serif;
        }

        p {
            padding: 16px;
            margin: 0px;
        }
    </style>
</head>
<body>

<div id="game"></div>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create });

    function preload() {

        game.load.image('phaser', 'assets/phaser.png');
        game.load.tilemap('nes', 'assets/mario1.png', 'assets/mario1.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('snes', 'assets/smb_tiles.png', 'assets/smb_level1.json', null, Phaser.Tilemap.JSON);

    }

    function create() {

        game.stage.backgroundColor = '#5c94fc';

        game.add.tilemap(0, 0, 'nes');
        game.add.tilemap(0, 168, 'snes');

        var logo = game.add.sprite(688, 8, 'phaser');
        logo.scrollFactor.setTo(0, 0);

        game.add.tween(game.camera).to( { x: 4320 }, 30000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        game.input.onDown.add(goFull, this);

    }

    function goFull() {
        game.stage.scale.startFullScreen();
    }

})();
</script>

<p>Potential game idea here? :)</p>
<p>Click game to full-screen (if supported)</p>
<p>Created with <a href="https://github.com/photonstorm/phaser">Phaser 1.0</a> by <a href="https://twitter.com/photonstorm">@photonstorm</a></p>

</body>
</html>