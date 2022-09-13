
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('contra', 'assets/pics/contra2.png');

}

var image;

function create() {

    //  142
    image = game.add.image(400-71, 0, 'contra', null, game.stage);

    game.add.tween(image).to( { y: 300 }, 2000, 'Bounce.easeOut', true, 0, -1, true);

}
