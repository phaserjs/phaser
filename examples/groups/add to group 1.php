<?php
    $title = "Adding to group using 'add'";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render });

   var friendAndFoe,
        enemies;

    function preload() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        
    }
    function create() {

        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // Use game.add (GameObjectFactory) to create sprites, those
        // newly created ones will be added to game.world.group
        // automatically. While you can still use new to allocate and
        // only add them to your own groups.
         var ufo = game.add.sprite(200, 240, 'ufo');
        friendAndFoe.add(ufo);


        // Create some enemies using new keyword.
        // (Don't forget to pass game as the first parameter.)
        var enemy;
        for (var i = 0; i < 16; i++) {

            enemy = new Phaser.Sprite(game,
                360 + Math.random() * 200, 120 + Math.random() * 200,
                'baddie');

            enemies.add(enemy);
        }

    }
    function render() {

        game.debug.renderText('ufo added to game.world.and "friendAndFoe" group', 20, 24);
        game.debug.renderText('others ONLY added to "enemies" group', 20, 40);

    }



})();

</script>

<?php
    require('../foot.php');
?>

