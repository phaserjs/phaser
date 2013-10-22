
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('sky', 'assets/skies/sky4.png');
    game.load.spritesheet('phaser', 'assets/tests/tween/phaser.png', 70, 90);
    
}

function create() {

    game.add.sprite(0, 0, 'sky');

    var item;

    for (var i = 0; i < 6; i++)
    {
        item = game.add.sprite(190 + 69 * i, -100, 'phaser', i);
        item.anchor.setTo(0.5,0.5);

        // Add a simple bounce tween to each character's position.
        game.add.tween(item).to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);

        // Add another rotation tween to the same character.
        game.add.tween(item).to({angle: 360}, 2400, Phaser.Easing.Cubic.In, true, 1000 + 400 * i, false);
    }

}
