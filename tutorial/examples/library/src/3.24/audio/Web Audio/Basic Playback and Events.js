/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 *
 * Prometheus Brings Fire To Mankind - Painting by Heinrich Füger, 1817, Public Domain
 * The Creatures of Prometheus, Op. 43, Overture - Music by Ludwig van Beethoven, 1801, Public Domain
 */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var text;

function preload ()
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=Sorts+Mill+Goudy';
    head.appendChild(link);

    this.load.image('prometheus', 'assets/pics/Prometheus Brings Fire To Mankind.jpg');

    this.load.audio('overture', [
        'assets/audio/Ludwig van Beethoven - The Creatures of Prometheus, Op. 43/Overture.ogg',
        'assets/audio/Ludwig van Beethoven - The Creatures of Prometheus, Op. 43/Overture.mp3'
    ]);

    this.load.audioSprite('creatures', 'assets/audio/Ludwig van Beethoven - The Creatures of Prometheus, Op. 43/sprites.json', [
        'assets/audio/Ludwig van Beethoven - The Creatures of Prometheus, Op. 43/sprites.ogg',
        'assets/audio/Ludwig van Beethoven - The Creatures of Prometheus, Op. 43/sprites.mp3'
    ]);
}

var first;
var second;
var audioSprite;

var tests = [

    function (fn)
    {
        first.once('play', function (sound)
        {
            text.setText('Playing');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.play();
    },

    function (fn)
    {
        first.once('pause', function (sound)
        {
            text.setText('Paused');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.pause();
    },

    function(fn)
    {
        first.once('resume', function (sound)
        {
            text.setText('Resuming');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.resume();
    },

    function(fn)
    {
        first.once('stop', function (sound)
        {
            text.setText('Stopped');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.stop();
    },

    function(fn)
    {
        first.once('play', function (sound)
        {
            text.setText('Play from start');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.play();
    },

    function(fn)
    {
        first.once('rate', function (sound, value)
        {
            text.setText('Speed up rate');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.rate = 1.5;
    },

    function(fn)
    {
        first.once('detune', function (sound, value)
        {
            text.setText('Speed up detune');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.detune = 600;
    },

    function(fn)
    {
        first.once('rate', function (sound, value)
        {
            text.setText('Slow down rate');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.rate = 1;
    },

    function(fn)
    {
        first.once('detune', function (sound, value)
        {
            text.setText('Slow down detune');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.detune = 0;
    },

    function(fn)
    {
        this.tweens.add({

            onStart: function ()
            {
                text.setText('Fade out');
            },

            targets: first,
            volume: 0,

            ease: 'Linear',
            duration: 2000,

            onComplete: fn
        });
    },

    function(fn)
    {
        this.tweens.add({

            onStart: function ()
            {
                text.setText('Fade in');
            },

            targets: first,
            volume: 1,

            ease: 'Linear',
            duration: 2000,

            onComplete: fn
        });
    },

    function(fn)
    {
        first.once('mute', function()
        {
            text.setText('Mute');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.mute = true;
    },

    function(fn)
    {
        first.once('mute', function()
        {
            text.setText('Unmute');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.mute = false;
    },

    function(fn)
    {
        first.once('volume', function()
        {
            text.setText('Half volume');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.volume = 0.5;
    },

    function(fn)
    {
        first.once('volume', function()
        {
            text.setText('Full volume');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.volume = 1;
    },

    function(fn)
    {
        first.once('seek', function()
        {
            text.setText('Seek to start');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        first.seek = 0;
    },

    function(fn)
    {
        second.once('play', function()
        {
            text.setText('Play 2nd');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        second.play();
    },

    function(fn)
    {
        this.sound.once('mute', function (soundManager, value)
        {
            text.setText('Mute global');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.mute = true;
    },

    function(fn)
    {
        this.sound.once('mute', function (soundManager, value)
        {
            text.setText('Unmute global');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.mute = false;
    },

    function(fn)
    {
        this.sound.once('volume', function (soundManager, value)
        {
            text.setText('Half volume global');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.volume = 0.5;
    },

    function(fn)
    {
        this.tweens.add({

            onStart: function ()
            {
                text.setText('Fade out global');
            },

            targets: this.sound,
            volume: 0,

            ease: 'Linear',
            duration: 2000,

            onComplete: fn
        });
    },

    function(fn)
    {
        this.tweens.add({

            onStart: function ()
            {
                text.setText('Fade in global');
            },

            targets: this.sound,
            volume: 1,

            ease: 'Linear',
            duration: 2000,

            onComplete: fn
        });
    },

    function(fn)
    {
        this.sound.once('pauseall', function (soundManager)
        {
            text.setText('Pause all');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.pauseAll();
    },

    function(fn)
    {
        this.sound.once('resumeall', function (soundManager)
        {
            text.setText('Resume all');
            this.time.addEvent({
                delay: 2000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.resumeAll();
    },

    function(fn)
    {
        this.sound.once('stopall', function (soundManager)
        {
            text.setText('Stop all');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        this.sound.stopAll();
    },

    function(fn)
    {
        audioSprite.once('play', function (sound)
        {
            text.setText('Play sprite');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        audioSprite.play('07');
    },

    function(fn)
    {
        audioSprite.once('pause', function (sound)
        {
            text.setText('Pause sprite');
            this.time.addEvent({
                delay: 1000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        audioSprite.pause();
    },

    function(fn)
    {
        audioSprite.once('resume', function (sound)
        {
            text.setText('Resume sprite');
            this.time.addEvent({
                delay: 1500,
                callback: fn,
                callbackScope: this
            });
        }, this);

        audioSprite.resume();
    },

    function(fn)
    {
        audioSprite.once('play', function (sound)
        {
            text.setText('Multiple sprites');
            this.time.addEvent({
                delay: 10000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        var sounds = ['01', '02', '03', '03', '05'];

        for (var i=0; i<sounds.length; i++)
        {
            this.time.addEvent({
                delay: i * 2000,
                callback: audioSprite.play.bind(audioSprite, sounds[i]),
                callbackScope: audioSprite
            });
        }
    },

    function(fn)
    {
        audioSprite.once('play', function (sound)
        {
            text.setText('Loop sprite');
            this.time.addEvent({
                delay: 4000,
                callback: fn,
                callbackScope: this
            });
        }, this);

        audioSprite.play('06', {
            loop: true
        });
    },

    function(fn)
    {
        this.tweens.add({

            onStart: function ()
            {
                text.setText('Fade out sprite');
            },

            targets: audioSprite,
            volume: 0,

            ease: 'Linear',
            duration: 4000,

            onComplete: function()
            {
                audioSprite.volume = 1;
                audioSprite.stop();

                fn();
            }
        });
    }
];

function create ()
{
    this.sound.pauseOnBlur = false;

    var prometheus = this.add.image(400, 300, 'prometheus');
    prometheus.setScale(600/prometheus.height);

    text = this.add.text(400, 300, 'Loading...', {
        fontFamily: '\'Sorts Mill Goudy\', serif',
        fontSize: 80,
        color: '#fff',
        align: 'center'
    });
    text.setOrigin(0.5);
    text.setShadow(0, 1, "#888", 2);

    first = this.sound.add('overture', { loop: true });
    second = this.sound.add('overture', { loop: true });
    audioSprite = this.sound.addAudioSprite('creatures');

    enableInput.call(this);
}

function chain(i)
{
    return function()
    {
        if (tests[i])
        {
            tests[i].call(this, chain.call(this, ++i));
        }
        else
        {
            text.setText('Complete!');

            this.time.addEvent({
                delay: 5000,
                callback: enableInput,
                callbackScope: this
            });
        }
    }.bind(this);
}

function enableInput()
{
    text.setText('Click to start');

    this.input.once('pointerdown', function (pointer)
    {
        tests[0].call(this, chain.call(this, 1));
    }, this);
}
