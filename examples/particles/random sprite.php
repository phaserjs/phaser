<?php
    $title = "Random Sprite";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var emitter;

    function preload() {

        game.load.image('carrot', 'assets/sprites/carrot.png');
        game.load.image('star', 'assets/misc/star_particle.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');

    }

    function create() {

        game.stage.backgroundColor = 0x337799;

        emitter = game.add.emitter(game.world.centerX, 200, 200);

        //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
        emitter.makeParticles(['diamond', 'carrot', 'star']);

        emitter.start(false, 5000, 20);

    }

    function update() {
    }

    function render() {
    }

})();
</script>

<?php
    require('../foot.php');
?>