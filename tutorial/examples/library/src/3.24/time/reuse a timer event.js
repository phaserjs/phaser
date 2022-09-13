var config = {
    type: Phaser.AUTO,
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

    timedEvent = new Phaser.Time.TimerEvent({ delay: 4000 });

    this.time.addEvent(timedEvent);

    this.input.on('pointerdown', () => {

        this.time.addEvent(timedEvent);

    }, this);
}

function update ()
{
    var progress = timedEvent.getProgress();

    text.setText([
        'Click to restart the Timer',
        'Event.progress: ' + progress.toString().substr(0, 4)
    ]);

    image.setAngle(progress * 20);
}
