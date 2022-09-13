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

    this.add.image(700, 300, 'arrow').setAlpha(0.5);

    var arrow = this.add.image(100, 300, 'arrow');

    tween = this.tweens.add({
        targets: arrow,
        x: 700,
        ease: 'Linear',
        duration: 3000
    });

    this.input.on('pointerdown', function () {

        tween.restart();

    });
}

function update ()
{
    if (tween.isPlaying())
    {
        text.setText('Progress: ' + tween.progress);
    }
    else
    {
        text.setText('Click to restart: ' + tween.state);
    }
}
