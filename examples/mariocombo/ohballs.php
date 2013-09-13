<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - oh balls</title>
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

    var p;

    function preload() {

        game.load.spritesheet('balls', 'assets/balls.png', 17, 17);

    }

    function create() {

        game.stage.backgroundColor = 0x337799;

        p = game.add.emitter(100, 100, 250);
        p.makeParticles('balls', [0,1,2,3,4,5]);
        p.minParticleSpeed.setTo(-100, -100);
        p.maxParticleSpeed.setTo(100, -200);
        p.gravity = 10;
        p.start(false, 3000, 10);

        game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    }

    function update() {

        p.y = game.input.y;

        if (p.y < 100)
        {
            p.y = 100;
        }

    }

})();
</script>

<p>Mouse to move</p>
<p>Created with <a href="https://github.com/photonstorm/phaser">Phaser 1.0</a> by <a href="https://twitter.com/photonstorm">@photonstorm</a></p>

</body>
</html>