
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

var r;
var pic;

function create() {

    pic = game.add.sprite(game.world.centerX, 550, 'trsi');
    pic.anchor.setTo(0.5, 1);

    r = new Phaser.Rectangle(0, 0, 200, pic.height);

    game.add.tween(r).to( { x: pic.width - 200 }, 3000, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

}

function update() {

    //  Apply the new crop Rectangle to the sprite
    pic.crop = r;

}
