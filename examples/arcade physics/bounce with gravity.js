// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('flyer', 'assets/sprites/phaser-dude.png');
}

var image;

function create() {

    //  This creates a simple sprite that is using our loaded image and displays it on-screen and assign it to a variable
    image = game.add.sprite(400, 200, 'flyer');
    
    //  This gets it moving
    image.body.velocity.setTo(200, 200);
    
    //  This makes the game world bounce-able
    image.body.collideWorldBounds = true;
    
    //  This sets the image bounce energy for the horizontal  and vertical vectors (as an x,y point). "1" is 100% energy return
    image.body.bounce.setTo(0.8, 0.8);
    
    //  This sets the gravity the sprite responds to in the world, as a point
    //  Leave x=0 and set y=180 to simulate falling
    image.body.gravity.setTo(0, 180);

}

function update () {

    // nothing required here
    
}

function render () {

    //debug helper
    game.debug.spriteInfo(image,32,32);

}
