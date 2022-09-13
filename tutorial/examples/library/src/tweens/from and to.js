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
var tween;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('makoto', 'assets/pics/makoto.png');
}

function create ()
{
    image = this.add.image(400, 300, 'makoto');
    
    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    tween = this.tweens.add({
        targets: image,
        alpha: 0.1,
        delay: 2000,
        duration: 6000
    });

    /*
    tween = this.tweens.add({
        targets: image,
        alpha: {
            from: 0,
            to: 1
        },
        delay: 2000,
        duration: 6000
    });
    */

    /*
    tween = this.tweens.add({
        targets: image,
        alpha: {
            start: 0,
            to: 1
        },
        delay: 2000,
        duration: 6000
    });
    */

    /*
    tween = this.tweens.add({
        targets: image,
        alpha: {
            start: 0.1,
            from: 1,
            to: 0.1
        },
        delay: 2000,
        duration: 2000
    });
    */
}

function update ()
{
    debugTweenData(text, tween.data[0]);
}

function debugTweenData (text, tweenData)
{
    var output = [];

    var TDStates = [
        'CREATED',
        'INIT',
        'DELAY',
        'OFFSET_DELAY',
        'PENDING_RENDER',
        'PLAYING_FORWARD',
        'PLAYING_BACKWARD',
        'HOLD_DELAY',
        'REPEAT_DELAY',
        'COMPLETE'
    ];

    output.push(tweenData.key);
    output.push('--------');
    output.push('State: ' + TDStates[tweenData.state]);
    output.push('Start: ' + tweenData.start);
    output.push('Current: ' + tweenData.current);
    output.push('End: ' + tweenData.end);
    output.push('Progress: ' + tweenData.progress);
    output.push('Elapsed: ' + tweenData.elapsed);
    output.push('Duration: ' + tweenData.duration);
    output.push('Total Duration: ' + tweenData.totalDuration);
    output.push('Delay: ' + tweenData.delay);
    output.push('Yoyo: ' + tweenData.yoyo);
    output.push('Hold: ' + tweenData.hold);
    output.push('Repeat: ' + tweenData.repeat);
    output.push('Repeat Counter: ' + tweenData.repeatCounter);
    output.push('Repeat Delay: ' + tweenData.repeatDelay);

    text.setText(output);
}
