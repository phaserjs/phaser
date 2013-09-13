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

        sprite1 = game.add.sprite(0, 200, 'atari');
        sprite1.name = 'atari';
        //  We'll use a random velocity here so we can test it in our processHandler
        sprite1.body.velocity.x = 50 + Math.random() * 100;
        //  This tells phaser to not use the built-in body separation, instead you should handle it in your process callback (see below)
        sprite1.body.customSeparateX = true;

        sprite2 = game.add.sprite(750, 220, 'mushroom');
        sprite2.name = 'mushroom';
        //  We'll use a random velocity here so we can test it in our processHandler
        sprite2.body.velocity.x = -(50 + Math.random() * 100);
        //  This tells phaser to not use the built-in body separation, instead you should handle it in your process callback (see below)
        sprite2.body.customSeparateX = true;

    }

    function update() {

        game.physics.collide(sprite1, sprite2, collisionHandler, processHandler, this);

    }

    function processHandler (obj1, obj2) {

        //  This function can perform your own additional checks on the 2 objects that collided.
        //  For example you could test for velocity, health, etc.
        //  If you want the collision to be deemed successful this function must return true.
        //  In which case the collisionHandler will be called, otherwise it won't.

        //  Note: the objects will have already been separated by this point unless you have set
        //  their customSeparateX/Y flags to true. If you do that it's up to you to handle separation.

        //  Whichever one is going fastest wins, the other dies :)
        if (obj1.body.velocity.x > Math.abs(obj2.body.velocity.x))
        {
            obj2.kill();
            obj1.body.velocity.x = 0;
        }
        else
        {
            obj1.kill();
            obj2.body.velocity.x = 0;
        }

        return true;

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