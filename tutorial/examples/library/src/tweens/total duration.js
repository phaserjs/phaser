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

var text;
var tween;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var marker = this.add.image(100, 300, 'block').setAlpha(0.3);
    var image = this.add.image(100, 300, 'block');

    text = this.add.text(30, 20, '0', { font: '16px Courier', fill: '#00ff00' });

    //  Expected totalDuration = 6000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        loop: 2
    });
    */

    //  Expected totalDuration = 6000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        repeat: 2
    });
    */

    //  Expected totalDuration = 12000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        repeat: 2,
        loop: 1
    });
    */

    //  Expected totalDuration = 4000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        yoyo: true
    });
    */

    //  Expected totalDuration = 8000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        yoyo: true,
        repeat: 1
    });
    */

    //  Expected totalDuration = 16000
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        yoyo: true,
        repeat: 1,
        loop: 1
    });
    */

    //  Expected totalDuration = 16500
    /*
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        yoyo: true,
        repeat: 1,
        loop: 1,
        loopDelay: 500
    });
    */

    //  Expected totalDuration = 17500
    tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 2000,
        yoyo: true,
        repeat: 1,
        repeatDelay: 500,
        loop: 1,
        loopDelay: 500
    });
}

function update ()
{
    //  Tween
    text.setText([
        'Progress: ' + tween.progress,
        'Total Progress: ' + tween.totalProgress,
        'Elapsed: ' + tween.elapsed,
        'Total Elapsed: ' + tween.totalElapsed,
        'Loop: ' + tween.loop,
        'LoopDelay: ' + tween.loopDelay,
        'Duration: ' + tween.duration,
        'Total Duration: ' + tween.totalDuration
    ]);
}
