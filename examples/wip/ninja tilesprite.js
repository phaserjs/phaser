
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var ball;
var sprite;
var cursors;

function create() {

	game.physics.startSystem(Phaser.Physics.NINJA);

    sprite = game.add.tileSprite(100, 100, 200, 200, 'starfield');
    sprite.autoScroll(0, 100);

    game.physics.ninja.enableAABB(sprite);
    // game.physics.ninja.enableTile(sprite, 14);

    //  By default Tiles have gravity and world collision disabled (as they are mostly used for platforms and the likes)
    //  We re-enable it here
    // sprite.body.gravityScale = 1;
    // sprite.body.collideWorldBounds = true;

    ball = game.add.sprite(400, 0, 'ball');

    //  Enable the physics body for the Ninja physics system
    game.physics.ninja.enableCircle(ball, ball.width / 2);

    //  A little more bounce
    ball.body.bounce = 0.5;

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.ninja.collide(sprite, ball);

    if (cursors.left.isDown)
    {
        sprite.body.moveLeft(20);
    }
    else if (cursors.right.isDown)
    {
        sprite.body.moveRight(20);
    }

    if (cursors.up.isDown)
    {
        sprite.body.moveUp(20);
    }
    else if (cursors.down.isDown)
    {
        sprite.body.moveDown(20);
    }

}

function render() {

    var r = new Phaser.Rectangle(sprite.body.x - (sprite.body.width / 2), sprite.body.y - (sprite.body.height / 2), sprite.body.width, sprite.body.height);

	// game.debug.text(sprite.body.x, 32, 32);
	// game.debug.text(sprite.body.y, 32, 64);
 //    game.debug.text(sprite.body.width, 128, 32);
 //    game.debug.text(sprite.body.height, 128, 64);
    // game.debug.geom(r, 'rgba(0,255,0,0.4)', true);

}
