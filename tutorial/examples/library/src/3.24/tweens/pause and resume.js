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

var text;
var tween;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var marker = this.add.image(100, 200, 'block').setAlpha(0.3);
    var image = this.add.image(100, 200, 'block');

    text = this.add.text(30, 20, '0', { font: '16px Courier', fill: '#00ff00' });

    tween = this.tweens.add({
        targets: image,
        x: 700,
        y: 500,
        duration: 3000,
        ease: 'Power2',
        yoyo: true,
        repeat: -1,
        paused: true
    });

    this.input.on('pointerdown', function () {

        if (tween.isPlaying())
        {
            tween.pause();
        }
        else
        {
            tween.resume();
        }

    });

}

function update ()
{
    //  Tween
    text.setText([
        'Progress: ' + tween.progress,
        'Elapsed: ' + tween.elapsed,
        'Duration: ' + tween.duration,
    ]);
}
