
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('ball', 'assets/sprites/pangball.png');

}

var t;

function create() {

    game.stage.backgroundColor = '#6688ee';

    t = game.time.create(false);

    t.repeat(Phaser.Timer.SECOND * 2, 10, createBall, this);
    t.repeat(Phaser.Timer.SECOND * 3, 10, createBall, this);

    t.start();

    game.input.onDown.add(killThem, this);

}

function createBall() {

    //  A bouncey ball sprite just to visually see what's going on.
    var ball = game.add.sprite(game.world.randomX, 0, 'ball');

    ball.body.gravity.y = 200;
    ball.body.bounce.y = 0.5;
    ball.body.collideWorldBounds = true;

console.log('nuked');
    game.time.removeAll();
    // t.removeAll();


}

function killThem() {


}

function render() {

    game.debug.text("Time until event: " + t.duration.toFixed(0), 32, 32);
    game.debug.text("Next tick: " + t.next.toFixed(0), 32, 64);

}
