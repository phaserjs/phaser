
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('arrow', 'assets/sprites/longarrow.png');

}

var sprite;
var cursors;


function create() {

	game.stage.backgroundColor = '#124184';

	sprite = game.add.sprite(400, 300, 'arrow');

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    if (cursors.left.isDown)
    {
        sprite.body.angularVelocity = -100;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.angularVelocity = 100;
    }

    if (cursors.up.isDown)
    {
        game.physics.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }

}

function render() {

	game.debug.bodyInfo(sprite, 16, 24);

}
