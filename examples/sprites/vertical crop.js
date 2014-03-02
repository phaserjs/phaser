
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create , update : update});

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

var pic;
var cropRect;

function create() {

    pic = game.add.sprite(game.world.centerX, 550, 'trsi');

    pic.anchor.setTo(0.5, 1);

    
	cropRect = {x : 0, y : 0 , width : pic.width, height : 0};

    //	Here we'll tween the crop rect, from a height of zero to full height, and back again
    game.add.tween(cropRect).to( { height: pic.height }, 3000, Phaser.Easing.Bounce.Out, true, 0, 1000, true);

}

function update () {
    //  the crop method takes a rectangle object as a parameter
    pic.crop(cropRect);
}


