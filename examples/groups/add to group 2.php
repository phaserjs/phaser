<?php
    $title = "Adding to group using create";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render });

   function preload() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        
    }

    var friendAndFoe,
        enemies;

    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // You can directly create sprite and add it to a group
        // using just one line. 
        friendAndFoe.create(200, 240, 'ufo');

        // Create some enemies.
        for (var i = 0; i < 8; i++) {
            createBaddie();
        }

        // Tap to create new baddie sprites.
        game.input.onTap.add(createBaddie, this);
    }
    function createBaddie() {

        enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200,'baddie');
    }

    function render() {

        game.debug.renderText('Tap screen or click to create new baddies.', 16, 24);
    }


})();

</script>

<?php
    require('../foot.php');
?>

