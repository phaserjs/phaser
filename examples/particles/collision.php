<?php
    $title = "Collision";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

    var emitter;

    function preload() {

        game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

    }

    function create() {

        emitter = game.add.emitter(game.world.centerX, game.world.centerY, 250);

        emitter.makeParticles('veggies', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);

        emitter.minParticleSpeed.setTo(-200, -300);
        emitter.maxParticleSpeed.setTo(200, -400);
        emitter.gravity = 8;
        emitter.bounce.setTo(0.5, 0.5);
        emitter.particleDrag.x = 10;
        emitter.angularDrag = 30;

        emitter.start(false, 8000, 400);

    }

    function update() {

        game.physics.collide(emitter, emitter);

    }


</script>

<?php
    require('../foot.php');
?>