<?php
    $title = "Group vs. Group Collision";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('phaser', 'assets/sprites/phaser-dude.png');
        game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

    }

    var sprite;
    var group;

    function create() {

        game.stage.backgroundColor = '#2d2d2d';

        //  This will check Sprite vs. Group collision

        sprite = game.add.sprite(32, 200, 'phaser');
        sprite.name = 'phaser-dude';

        group = game.add.group();

        for (var i = 0; i < 50; i++)
        {
            var c = group.create(100 + Math.random() * 700, game.world.randomY, 'veggies', game.rnd.integerInRange(0, 36));
            c.name = 'veg' + i;
            c.body.immovable = true;
        }

        for (var i = 0; i < 20; i++)
        {
            //  Here we'll create some chillis which the player can pick-up. They are still part of the same Group.
            var c = group.create(100 + Math.random() * 700, game.world.randomY, 'veggies', 17);
            c.name = 'chilli' + i;
            c.body.immovable = true;
        }

    }

    function update() {

        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            sprite.body.velocity.x = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            sprite.body.velocity.x = 200;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            sprite.body.velocity.y = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            sprite.body.velocity.y = 200;
        }

        game.physics.collide(sprite, group, collisionHandler, null, this);

    }

    function collisionHandler (obj1, obj2) {

        //  If the player collides with the chillis then they get eaten :)
        //  The chilli frame ID is 17

        console.log('Hit', obj2.name);

        if (obj2.frame == 17)
        {
            obj2.kill();
        }

    }

    function render () {

        game.debug.renderQuadTree(game.physics.quadTree);

    }



</script>

<?php
    require('../foot.php');
?>