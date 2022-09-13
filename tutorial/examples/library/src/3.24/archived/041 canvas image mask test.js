
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bunny', 'assets/sprites/bunny.png');
    game.load.image('gem', 'assets/sprites/gem.png');

}

var image;

function create() {

    image = game.add.image(0, 0, 'bunny', 0, game.stage);
    var image2 = game.add.image(150, 100, 'bunny', 0, game.stage);
    var image3 = game.add.image(300, 70, 'gem', 0, game.stage);

}
