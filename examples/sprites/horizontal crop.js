
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update : update });

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

var pic;
var cropRect;

function create() {

    pic = game.add.sprite(game.world.centerX, 550, 'trsi');

    pic.anchor.setTo(0.5, 1);

    cropRect = {x : 0, y : 0 , width : 0, height : pic.height};

    // Here we'll tween the crop rect, from a width of zero to full width, and back again
    game.add.tween(cropRect).to( { width: pic.width }, 3000, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

}

function update () {
    //  the crop method takes a rectangle object as a parameter
    pic.crop(cropRect);
}
