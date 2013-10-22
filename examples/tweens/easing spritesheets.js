
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {preload:preload,create: create });

function preload() {

    game.load.spritesheet('phaser', 'assets/tests/tween/phaser.png', 70, 90);
    game.load.image('starfield', 'assets/misc/starfield.jpg');
    
}

function create() {

    var item;

    game.add.tileSprite(0, 0, 800, 600, 'starfield');

    for (var i = 0; i < 6; i++)
    {
        item = game.add.sprite(190 + 69 * i, -90, 'phaser', i);

        // Add a simple bounce tween to each character's position.
        game.add.tween(item).to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
    }

}
