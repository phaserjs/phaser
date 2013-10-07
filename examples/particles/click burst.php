<?php
    $title = "Click to Burst";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    var emitter;

    function preload() {

        game.load.image('diamond', 'assets/sprites/diamond.png');

    }

    function create() {

        game.stage.backgroundColor = 0x337799;

        emitter = game.add.emitter(0, 0, 200);

        emitter.makeParticles('diamond');
        emitter.gravity = 10;

        game.input.onDown.add(particleBurst, this);

    }

    function particleBurst() {

        //  Position the emitter where the mouse/touch event was
        emitter.x = game.input.x;
        emitter.y = game.input.y;

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        emitter.start(true, 2000, null, 10);

    }


</script>

<?php
    require('../foot.php');
?>