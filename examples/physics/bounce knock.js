// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('dude', 'assets/sprites/phaser-dude.png');
    game.load.image('ball', 'assets/sprites/pangball.png');
    
}

var image;

function create() {

    cursors = game.input.keyboard.createCursorKeys();
    
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    ball = game.add.sprite(400, 200, 'ball');

    knocker = game.add.sprite(400, 200, 'dude');
    knocker.body.immovable = true;

    //  This gets it moving
    ball.body.velocity.setTo(200, 200);

    //  This makes the game world bounce-able
    ball.body.collideWorldBounds = true;

    //  This sets the image bounce energy for the horizontal 
    //  and vertical vectors (as an x,y point). "1" is 100% energy return
    ball.body.bounce.setTo(1, 1);

    //  This sets the gravity the sprite responds to in the world, as a point
    //  Here we leave x=0 and set y=80 to simulate falling
    ball.body.gravity.setTo(0, 80);

}

//  Move the knocker with the arrow keys
function update () {

    //  Enable physics between the knocker and the ball
    game.physics.collide(knocker, ball);

    if (cursors.up.isDown)
    {
        knocker.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
        knocker.body.velocity.y =  300;
    }
    else if (cursors.left.isDown)
    {
        knocker.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        knocker.body.velocity.x = 300;
    } 
    else
    {
        knocker.body.velocity.setTo(0, 0);
    }
    
}

function render () {

    //debug helper
    game.debug.renderSpriteInfo(ball, 32, 32);

}
