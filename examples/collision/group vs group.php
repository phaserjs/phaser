<?php
	$title = "Group vs. Group Collision";
	require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {

        game.load.image('phaser', 'assets/sprites/phaser-dude.png');
        game.load.image('bullet', 'assets/misc/bullet0.png');
        game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

    }

    var sprite;
    var bullets;
    var veggies;
    var bulletTime = 0;

    var bullet;

    function create() {

        game.stage.backgroundColor = '#2d2d2d';

        //  This will check Group vs. Group collision (bullets vs. veggies!)

        veggies = game.add.group();

        for (var i = 0; i < 50; i++)
        {
            var c = veggies.create(game.world.randomX, Math.random() * 500, 'veggies', game.rnd.integerInRange(0, 36));
            c.name = 'veg' + i;
            c.body.immovable = true;
        }

        bullets = game.add.group();

        for (var i = 0; i < 10; i++)
        {
            var b = bullets.create(0, 0, 'bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.events.onOutOfBounds.add(resetBullet, this);
        }

        sprite = game.add.sprite(400, 550, 'phaser');

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

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fireBullet();
        }

        game.physics.collide(bullets, veggies, collisionHandler, null, this);

    }

    function fireBullet () {

        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(sprite.x + 6, sprite.y - 8);
                bullet.body.velocity.y = -300;
                bulletTime = game.time.now + 250;
            }
        }

    }

    //  Called if the bullet goes out of the screen
    function resetBullet (bullet) {
        bullet.kill();
    }

    function collisionHandler (bullet, veg) {

        bullet.kill();
        veg.kill();

    }



</script>

<?php
	require('../foot.php');
?>