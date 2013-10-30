
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.image('bullet', 'assets/misc/bullet0.png');
    game.load.image('alien', 'assets/sprites/space-baddie.png');
    game.load.image('ship', 'assets/sprites/shmup-ship.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
    game.load.image('starfield', 'assets/misc/starfield.jpg');

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;

function create() {

    s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

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

    //  Our bullet group
    bullets = game.add.group();
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    var tween = game.add.tween(aliens).to({x: 200}, 3000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onComplete.add(descend, this);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}


function descend() {
    aliens.y += 10;
}

function update() {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 200;
    }

    if (fireButton.isDown)
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
            bullet.body.velocity.y = -300;
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

    var explosionAnimation = explosions.getFirstDead();
    explosionAnimation.reset(alien.body.x, alien.body.y);
    explosionAnimation.play('kaboom', 30, false, true);

}

function render () {
}
