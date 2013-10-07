<?php
    $title = "Group vs. Group Collision";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('atari', 'assets/sprites/atari130xe.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');

    }

    var sprite1;
    var sprite2;

    function create() {

        game.stage.backgroundColor = '#2d2d2d';

        //  This will check Sprite vs. Sprite collision

        sprite1 = game.add.sprite(50, 200, 'atari');
        sprite1.name = 'atari';
        sprite1.body.velocity.x = 100;

        sprite2 = game.add.sprite(700, 220, 'mushroom');
        sprite2.name = 'mushroom';
        sprite2.body.velocity.x = -100;

    }

    function update() {

        // object1, object2, collideCallback, processCallback, callbackContext
        game.physics.collide(sprite1, sprite2, collisionHandler, null, this);

    }

    function collisionHandler (obj1, obj2) {

        game.stage.backgroundColor = '#992d2d';

        console.log(obj1.name + ' collided with ' + obj2.name);

    }

    function render() {
    }


</script>

<?php
    require('../foot.php');
?>