
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.image('bullet', 'assets/misc/bullet0.png');

}

var sprite;
var bullet;
var bullets;
var bulletTime = 0;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    bullets = game.add.group();
    bullets.createMultiple(10, 'bullet');
    bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetBullet, this);

    sprite = game.add.sprite(400, 550, 'phaser');

    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

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

