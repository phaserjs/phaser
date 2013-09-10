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

    var p;

    function preload() {

        game.load.image('carrot', 'assets/sprites/carrot.png');
        game.load.image('star', 'assets/misc/star_particle.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.image('dude', 'assets/sprites/phaser-dude.png');
        game.load.image('coke', 'assets/sprites/cokecan.png');

    }

    function create() {

        p = new Phaser.Particles.Arcade.Emitter(game, 200, 100, 500);

        // p.width = 200;
        // p.height = 200;

        p.makeParticles('diamond');

        //  Steady constant stream at 250ms delay and 10 seconds lifespan
        // p.start(false, 10000, 250, 100);

        // p.start(true, 10000);

        //  explode, lifespan, frequency, quantity
        p.minParticleSpeed.setTo(-100, -100);
        p.maxParticleSpeed.setTo(100, -200);
        p.gravity = 10;
        p.start(false, 3000, 10);

        game.add.tween(p).to({ emitX: 400 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    }

    function update() {

        p.update();

    }

    function render() {
    }

})();
</script>

</body>
</html>