
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('diamond', 'assets/sprites/diamond.png');

}

function create() {

    game.stage.backgroundColor = 0x2d2d2d;

    var sprite = game.add.sprite(100, 100, 'diamond');

    //  Here we'll chain 4 different tweens together and play through them all in a loop
    var tween = game.add.tween(sprite).to({ x: 600 }, 2000, Phaser.Easing.Linear.None)
    .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
    .to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
    .to({ y: 100 }, 1000, Phaser.Easing.Linear.None)
    .loop()
    .start();

}
