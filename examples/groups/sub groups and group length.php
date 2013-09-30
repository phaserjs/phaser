 
 <?php
    $title = "Group length and sub groups";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render});

    // Groups for storing friends and enemies, may use for collision later.
    var friendAndFoe,
        enemies;

    // Groups for teaming up stuff.
    var normalBaddies,
        purpleBaddies;

    function preload() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        game.load.image('purple-baddie', 'assets/sprites/space-baddie-purple.png');
        
    }
    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();
        normalBaddies = game.add.group();
        purpleBaddies = game.add.group();

        // Add both teams to enemies group, using the Pixi container otherwise it's impossible 
        enemies.add(normalBaddies._container);
        enemies.add(purpleBaddies._container);


        // Create a ufo as a friend sprite.
        friendAndFoe.create(200, 240, 'ufo');

        // Create some enemies.
        for (var i = 0; i < 16; i++) {
            createBaddie();
        }

        // Tap to create new baddie sprites.
        game.input.onTap.add(createBaddie, this);
    }
    function createBaddie() {
        var baddie;
        // Of course, the baddies created will belong to their respective groups
        if (Math.random() > 0.5) {
            baddie = purpleBaddies.create(360 + Math.random() * 200, 120 + Math.random() * 200,
                'purple-baddie');
        }
        else {
            baddie = normalBaddies.create(360 + Math.random() * 200, 120 + Math.random() * 200,
                'baddie');
        }
    }
    function render() {
        game.debug.renderStyle = '#fff';
        game.debug.renderText('Tap screen or click to create new baddies.', 16, 24);
        game.debug.renderText('enemies: ' + enemies.length + ' (actually ' + enemies.length + ' groups)', 16, 48);
        game.debug.renderText('normal baddies: ' + normalBaddies.length, 16, 60);
        game.debug.renderText('purple baddies: ' + purpleBaddies.length, 16, 72);
        game.debug.renderText('friends: ' + friendAndFoe.length, 16, 96);
    }

})();

</script>

<?php
    require('../foot.php');
?>
