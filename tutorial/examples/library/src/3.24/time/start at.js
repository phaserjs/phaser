var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var text;
var timedEvent;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    image = this.add.image(400, 300, 'einstein');

    text = this.add.text(32, 32);

    //  A 10 second delay, but the first time it begins it'll start 5 seconds in, then on repeat will repeat for the full 10 seconds
    timedEvent = this.time.addEvent({ delay: 10000, callback: onEvent, callbackScope: this, repeat: 1, startAt: 5000 });
}

function update ()
{
    text.setText('Event.progress: ' + timedEvent.getProgress().toString().substr(0, 4) + '\nEvent.repeatCount: ' + timedEvent.repeatCount);
}

function onEvent ()
{
    image.scaleX *= 0.75;
    image.scaleY *= 0.75;
    image.rotation += 0.04;
}
