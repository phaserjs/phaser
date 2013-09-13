<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - mario party(cles)</title>
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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {

        game.load.tilemap('background', 'assets/smb_bg.png', 'assets/smb_bg.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('level1', 'assets/smb_tiles.png', 'assets/smb_level1.json', null, Phaser.Tilemap.JSON);
        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);
        game.load.image('phaser', 'assets/phaser.png');

    }

    var p;
    var map;

    function create() {

        game.stage.backgroundColor = '#787878';

        game.add.tilemap(0, 0, 'background');

        map = game.add.tilemap(0, 0, 'level1');
        map.setCollisionByIndex([9,10,11,14,15,16,18,19,22,23,24,32,37,38], true, true, true, true);

        p = game.add.emitter(300, 50, 500);
        p.bounce = 0.5;
        p.makeParticles('balls', [0,1,2,3,4,5], 500, 1);
        p.minParticleSpeed.setTo(-150, 150);
        p.maxParticleSpeed.setTo(100, 100);
        p.gravity = 8;
        p.start(false, 5000, 50);

        var logo = game.add.sprite(688, 8, 'phaser');
        logo.scrollFactor.setTo(0, 0);

        game.add.tween(p).to({ x: 4000 }, 7500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

        game.input.onDown.add(goFull, this);

    }

    function goFull() {
        game.stage.scale.startFullScreen();
    }

    function update() {

        map.collide(p);

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 8;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 8;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 8;
        }

    }

})();
</script>

<p>Left / Right arrows to scroll the map</p>
<p>Click game to full-screen (if supported)</p>
<p>Highlights a few visual glitches I need to work on :)</p>
<p>Created with <a href="https://github.com/photonstorm/phaser">Phaser 1.0</a> by <a href="https://twitter.com/photonstorm">@photonstorm</a></p>

</body>
</html>