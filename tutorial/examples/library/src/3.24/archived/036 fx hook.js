
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('gem', 'assets/sprites/gem.png');

}

var image;

function create() {

    // image = game.add.image(0, 0, 'gem');

    image = new Phaser.GameObject.Image(game, 0, 200, 'gem');

    image.fx.enable(Phaser.FX.Fade);

    //  Fades out the image over 5000ms, then the effect is done and removed?
    game.fx.fade(image, 5000);

    game.fx.glitch(image)

}
