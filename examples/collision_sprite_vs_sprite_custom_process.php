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

    function preload() {

        game.load.image('atari', 'assets/sprites/atari130xe.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');

    }

    var sprite1;
    var sprite2;

    function create() {

        game.stage.backgroundColor = '#2d2d2d';

        //  This will check Sprite vs. Sprite collision using a custom process callback

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

    function processHandler (obj1, obj2) {

        //  This function can perform your own additional checks on the 2 objects that collided.
        //  For example you could test for velocity, health, etc.
        //  If you want the collision to be deemed successful this function must return true.
        //  In which case the collisionHandler will be called, otherwise it won't.
        //  Note: the objects will have already collided and separated by this point.

    }

    function collisionHandler (obj1, obj2) {

        game.stage.backgroundColor = '#992d2d';

        console.log(obj1.name + ' collided with ' + obj2.name);

    }

    function render() {
    }

})();
</script>

</body>
</html>