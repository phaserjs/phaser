var config = {
    type: Phaser.WEBGL,
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

var arrow;
var tween;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    text = this.add.text(30, 20, '0', { font: '16px Courier', fill: '#00ff00' });

    arrow = this.add.image(400, 300, 'arrow');

    tween = this.tweens.add({
        targets: arrow,
        x: 400,
        y: 300,
        ease: 'Sine.easeIn',
        duration: 5000,
        paused: true
    });

    this.input.on('pointerdown', function () {

        tween.play();

    });
}

function update ()
{
    arrow.rotation = Math.atan2(this.input.y - arrow.y, this.input.x - arrow.x);

    if (tween.isPlaying())
    {
        tween.updateTo('x', this.input.x, true);
        tween.updateTo('y', this.input.y, true);

        text.setText('Progress: ' + tween.progress);
    }
    else
    {
        text.setText('Click to start');
    }
}
