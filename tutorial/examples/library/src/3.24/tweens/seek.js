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

var text1;
var text2;
var tween;
var progressBar;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var marker = this.add.image(100, 400, 'block').setAlpha(0.3);
    var image = this.add.image(100, 400, 'block');

    text1 = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    text2 = this.add.text(400, 10, '', { font: '16px Courier', fill: '#00ff00' });

    tween = this.tweens.add({
        targets: image,
        props: {
            x: { value: 700, duration: 4000, ease: 'Power2' },
            y: { value: 500, duration: 1500, ease: 'Bounce.easeOut' }
        },
        loop: 2,
        loopDelay: 1000
    });

    // tween = this.tweens.add({
    //     targets: image,
    //     props: {
    //         x: { value: 700, duration: 4000, ease: 'Power2' },
    //         y: { value: 500, duration: 1500, ease: 'Bounce.easeOut' }
    //     },
    //     delay: 2000,
    //     completeDelay: 2000
    // });

    // tween = this.tweens.add({
    //     targets: image,
    //     props: {
    //         x: { value: 700, duration: 4000, ease: 'Linear' },
    //     },
    //     delay: 2000,
    //     completeDelay: 2000
    // });

    this.input.on('pointerdown', function () {

        // var td = tween.data[0];

        // console.log('start', td.getStartValue(td.target, td.key, td.start));
        // console.log('end', td.getEndValue(td.target, td.key, td.end));

        tween.seek(0.01);

        // console.log('start', td.getStartValue(td.target, td.key, td.start));
        // console.log('end', td.getEndValue(td.target, td.key, td.end));

    });

    progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.min = '0';
    progressBar.max = '100';
    progressBar.step = '.001';
    progressBar.value = '50';

    document.body.appendChild(progressBar);

    progressBar.addEventListener('input', function (e) {

        tween.seek(e.target.value / 100);

    });

    progressBar.addEventListener('mousedown', function (e) {

        console.log('pause');

        tween.pause();

    });

    progressBar.addEventListener('mouseup', function (e) {

        console.log('resume');

        console.log(tween);

        tween.resume();

    });
}

function update ()
{
    debugTween(text1, tween);
    debugTweenData(text2, tween.data[0]);

    if (tween.isPlaying())
    {
        progressBar.value = Math.floor(tween.progress * 100);
    }

}

function debugTween (text, tween)
{
    var output = [];

    var TStates = [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        'PENDING_ADD',
        'PAUSED',
        'LOOP_DELAY',
        'ACTIVE',
        'COMPLETE_DELAY',
        'PENDING_REMOVE',
        'REMOVED'
    ];

    output.push('Tween');
    output.push('-----');
    output.push('State: ' + TStates[tween.state]);
    output.push('Total Progress: ' + tween.totalProgress);
    output.push('Total Duration: ' + tween.totalDuration);
    output.push('Total Elapsed: ' + tween.totalElapsed);
    output.push('Progress: ' + tween.progress);
    output.push('Duration: ' + tween.duration);
    output.push('Elapsed: ' + tween.elapsed);
    output.push('Loop: ' + tween.loop);
    output.push('Loop Delay: ' + tween.loopDelay);
    output.push('Loop Counter: ' + tween.loopCounter);
    output.push('Start Delay: ' + tween.startDelay);
    output.push('Complete Delay: ' + tween.completeDelay);
    output.push('Countdown: ' + tween.countdown);
    output.push('Has Started: ' + tween.hasStarted);

    text.setText(output);
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

