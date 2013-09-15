<?php
    $title = "Click to Burst";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var p;
    var p2;

    function preload() {

        // game.load.image('carrot', 'assets/sprites/carrot.png');
        // game.load.image('star', 'assets/misc/star_particle.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        // game.load.image('dude', 'assets/sprites/phaser-dude.png');
        // game.load.image('coke', 'assets/sprites/cokecan.png');
        // game.load.atlasJSONHash('pixies', 'assets/sprites/pixi_monsters.png', 'assets/sprites/pixi_monsters.json');
        game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

    }

    function create() {

        game.stage.backgroundColor = 0x337799;

        p = game.add.emitter(0, 0, 200);

        p.makeParticles('diamond');

        //  Steady constant stream at 250ms delay and 10 seconds lifespan
        // p.start(false, 10000, 250, 100);
        // p.start(true, 10000);

        //  explode, lifespan, frequency, quantity
        // p.minParticleSpeed.setTo(-100, -100);
        // p.maxParticleSpeed.setTo(100, -200);
        p.gravity = 10;

        // game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

        game.input.onDown.add(particleBurst, this);

    }

    function particleBurst() {

        p.x = game.input.x;
        p.y = game.input.y;
        p.start(true, 2000, 10, 10);

    }

    function update() {

        // p.y = game.math.min(100, game.input.y);

    }

    function render() {
    }

})();
</script>

<?php
    require('../foot.php');
?>