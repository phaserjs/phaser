//  Here we'll use a Physics Configuration object to specify which physics systems should be started with the game.

var physicsConfig = {

    arcade: true,
    ninja: false,
    p2: true

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false, false, physicsConfig);

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.spritesheet('bullets', 'assets/sprites/balls.png', 17, 17);

}

var atari;
var balls;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    balls = game.add.group();

    balls.createMultiple(250, 'bullets', 0, false);

    atari = game.add.sprite(300, 450, 'atari');

    game.physics.arcade.gravity.y = 400;

    //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
    game.physics.arcade.enable(game.world, true);

    atari.body.gravityScale.y = 0;
    atari.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.loop(150, fire, this);

}

function fire() {

    var ball = balls.getFirstExists(false);

    if (ball)
    {
        ball.frame = game.rnd.integerInRange(0,6);
        ball.exists = true;
        ball.reset(game.world.randomX, 0);

        ball.body.bounce.y = 0.8;
    }

}

function reflect(a, ball) {

    if (ball.y > (atari.y + 5))
    {
        return true;
    }
    else
    {
        ball.body.velocity.x = atari.body.velocity.x;
        ball.body.velocity.y *= -(ball.body.bounce.y);

        return false;
    }

}

function update() {

    game.physics.arcade.collide(atari, balls, null, reflect, this);

    atari.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        atari.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        atari.body.velocity.x = 200;
    }

    balls.forEachAlive(checkBounds, this);

}

function checkBounds(ball) {

    if (ball.y > 600)
    {
        ball.kill();
    }

}

function render() {

}
