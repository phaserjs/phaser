<?php
    $title = "Invaders";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('phaser', 'assets/sprites/phaser-dude.png');
        game.load.image('bullet', 'assets/misc/bullet0.png');
        game.load.image('alien', 'assets/sprites/space-baddie.png');
        game.load.image('ship', 'assets/sprites/shmup-ship.png');

    }

    var player;
    var aliens;
    var bullets;
    var bulletTime = 0;

    function create() {

        player = game.add.sprite(400, 500, 'ship');
        player.anchor.setTo(0.5, 0.5);

        aliens = game.add.group(null, 'aliens');

        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                aliens.create(x * 48, y * 50, 'alien');
            }
        }

        aliens.x = 100;
        aliens.y = 50;

        bullets = game.add.group(null, 'bullets');

        for (var i = 0; i < 10; i++)
        {
            var b = bullets.create(0, 0, 'bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.anchor.setTo(0.5, 1);
            b.events.onOutOfBounds.add(resetBullet, this);
        }

        var tween = game.add.tween(aliens).to({x: 200}, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        tween.onComplete.add(descend, this);

    }


    function descend() {
        aliens.y += 10;
    }

    function update() {

        player.velocity.x = 0;
        player.velocity.y = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            player.velocity.x = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            player.velocity.x = 200;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fireBullet();
        }

        game.physics.collide(bullets, aliens, collisionHandler, null, this);

    }

    function fireBullet () {

        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(player.x, player.y - 8);
                bullet.velocity.y = -300;
                bulletTime = game.time.now + 250;
            }
        }

    }

    //  Called if the bullet goes out of the screen
    function resetBullet (bullet) {
        bullet.kill();
    }

    function collisionHandler (bullet, alien) {

        bullet.kill();
        alien.kill();

    }

    function render () {

        // aliens.forEach(renderBounds, this);

        game.debug.renderQuadTree(game.physics.quadTree);

    }

    function renderBounds(s) {
        game.debug.renderSpriteBounds(s, 'rgba(0,0,255,0.4)', true);
    }


</script>

<?php
    require('../foot.php');
?>    
