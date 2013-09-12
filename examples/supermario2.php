<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('background', 'assets/maps/smb_bg.png', 'assets/maps/smb_bg.json', null, Phaser.Tilemap.JSON);
        game.load.tilemap('level1', 'assets/maps/smb_tiles.png', 'assets/maps/smb_level1.json', null, Phaser.Tilemap.JSON);
        game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

    }

    var p;
    var map;
    var test = [];
    var g;

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

        game.add.tween(p).to({ x: 4000 }, 7500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    }

    function update() {

        map.collide(g);
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

    function render() {
    }

})();
</script>

</body>
</html>