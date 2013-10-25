
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('plane', 'assets/misc/boss1.png');
    game.load.image('sky', 'assets/tests/sky-2x.png');

}

function create() {

    game.add.sprite(0, 0, 'sky');

    for (var i = 0; i < 15; i++)
    {
        var sprite = game.add.sprite(game.world.randomX, game.world.randomY, 'plane');

        sprite.inputEnabled = true;

        sprite.input.useHandCursor = true;

        sprite.events.onInputDown.add(destoyIt, this);
    }

}

function destoyIt (sprite) {

    sprite.destroy();
}
