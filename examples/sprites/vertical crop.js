
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

function create() {

    var pic = game.add.sprite(game.world.centerX, 550, 'trsi');

    pic.anchor.setTo(0.5, 1);

    //	By default Sprites ignore the crop setting, you have to explicitly enable it like this:
    pic.cropEnabled = true;

    //	Set the crop rect height to zero
    pic.crop.height = 0;

    //	Here we'll tween the crop rect, from a height of zero to full height, and back again
    game.add.tween(pic.crop).to( { height: pic.height }, 3000, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

}
