
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('world', 'assets/pics/world.png');

}

var image;

function create() {

    image = game.add.image(0, 0, 'world', null, game.stage);

    // image.color.alpha = 0.5;

    image.color.setBackground(255, 0, 255, 1);

    // image.color.red = 100;

    // game.add.tween(image.color).to( { red: 255, green: 20, blue: 200 }, 1000, 'Linear', true, 0, -1, true);

}
