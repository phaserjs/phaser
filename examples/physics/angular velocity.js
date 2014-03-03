
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');
}

var sprite;

function create() {

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'arrow');
    sprite.anchor.setTo(0.5, 0.5);

}

function update() {

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        sprite.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        sprite.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        game.physics.velocityFromAngle(sprite.angle, 300, sprite.body.velocity);
    }

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);
    game.debug.text('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
    game.debug.text('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
    game.debug.text('angularDrag: ' + sprite.body.angularDrag, 32, 264);
    game.debug.text('deltaZ: ' + sprite.body.deltaZ(), 32, 296);

}
