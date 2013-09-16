<?php
    $title = "When Particles Collide";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

    var leftEmitter;
    var rightEmitter;

    function preload() {

        game.load.image('ball1', 'assets/sprites/red_ball.png');
        game.load.image('ball2', 'assets/sprites/blue_ball.png');

    }

    function create() {

        leftEmitter = game.add.emitter(50, game.world.centerY - 200);
        leftEmitter.bounce.setTo(0.5, 0.5);
        leftEmitter.setXSpeed(100, 200);
        leftEmitter.setYSpeed(-50, 50);
        leftEmitter.makeParticles('ball1', 0, 250, 1, true);

        rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
        rightEmitter.bounce.setTo(0.5, 0.5);
        rightEmitter.setXSpeed(-100, -200);
        rightEmitter.setYSpeed(-50, 50);
        rightEmitter.makeParticles('ball2', 0, 250, 1, true);

        // explode, lifespan, frequency, quantity
        leftEmitter.start(false, 5000, 20);
        rightEmitter.start(false, 5000, 20);

    }

    function update() {
        game.physics.collide(leftEmitter, rightEmitter);
    }

})();
</script>

<?php
    require('../foot.php');
?>