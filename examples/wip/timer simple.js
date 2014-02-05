
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('sonic', 'assets/sprites/pangball.png');

}

var timer;

function create() {

    game.stage.backgroundColor = '#007236';



    //  Every second we will call the addSprite function. This will happen 10 times and then stop.
    //  The final parameter is the one that will be sent to the addSprite function and in this case is the sprite key.
    game.time.repeatEvent(Phaser.Timer.SECOND, 10, addSprite, this, 'mushroom');

    //  Every 1.5 seconds we will call the addSprite function. This will happen 5 times and then stop.
    game.time.repeatEvent(1500, 10, addSprite, this, 'sonic');

}

function addSprite(key) {

console.log(arguments);

    game.add.sprite(game.world.randomX, game.world.randomY, key);

}

function update() {

}

function render() {

    game.debug.renderText(game.time._timer.ms, 32, 32);
    // game.debug.renderCameraInfo(game.camera, 32, 32);

}
