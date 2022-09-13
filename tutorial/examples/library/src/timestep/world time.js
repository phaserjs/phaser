var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var timeText;

var game = new Phaser.Game(config);

function create ()
{
    timeText = this.add.text(100, 200);
}

function update (time, delta)
{
    timeText.setText('Time: ' + time + '\nDelta: ' + delta);
}
