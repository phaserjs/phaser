
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('ball', 'assets/sprites/pangball.png');

}

var counter = 0;
var text = 0;

function create() {

    game.stage.backgroundColor = '#6688ee';

    text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);

    //  Here we'll create a basic looped event.
    //  A looped event is like a repeat event but with no limit, it will literally repeat itself forever, or until

    //  The first parameter is how long to wait before the event fires. In this case 1 second (you could pass in 1000 as the value as well.)
    //  The next two parameters are the function to call ('updateCounter') and the context under which that will happen.


    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

}

function updateCounter() {

    counter++;

    text.setText('Counter: ' + counter);

}

function render() {

    game.debug.renderText("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
    game.debug.renderText("Next tick: " + game.time.events.next.toFixed(0), 32, 64);

}
