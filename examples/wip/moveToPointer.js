
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('arrow', 'assets/sprites/arrow.png');

}

var sprite;
var tween;

function create() {

    sprite = game.add.sprite(32, 32, 'arrow');

    sprite.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(moveSprite, this);

}

function moveSprite (pointer) {

    if (tween && tween.isRunning)
    {
        tween.stop();
    }

    sprite.rotation = game.physics.angleToPointer(sprite, pointer);

    //  300 = 300 pixels per second = the speed the sprite will move at, regardless of the distance it has to travel
    var duration = (game.physics.distanceToPointer(sprite, pointer) / 300) * 1000;

    tween = game.add.tween(sprite).to({ x: pointer.x, y: pointer.y }, duration, Phaser.Easing.Linear.None, true);

}

