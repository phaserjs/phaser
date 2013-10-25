
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create,update:update,render:render });

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('cactuar', 'assets/pics/cactuar.png');
}

var image;

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    image = game.add.sprite(0, 0, 'cactuar');

}

function update () {

	//magic formula to make an object follow the mouse
	game.physics.moveToPointer(image,300,game.input.activePointer);
}

function render () {
	//debug helper
	game.debug.renderInputInfo(32,32);
}
