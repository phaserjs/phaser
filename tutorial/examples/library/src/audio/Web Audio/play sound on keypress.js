var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('touhou', 'assets/pics/touhou1.png');

    this.load.setPath('assets/audio/tech');

    this.load.audio('bass', [ 'bass.ogg', 'bass.mp3' ]);
    this.load.audio('drums', [ 'drums.ogg', 'drums.mp3' ]);
    this.load.audio('percussion', [ 'percussion.ogg', 'percussion.mp3' ]);
    this.load.audio('synth1', [ 'synth1.ogg', 'synth1.mp3' ]);
    this.load.audio('synth2', [ 'synth2.ogg', 'synth2.mp3' ]);
    this.load.audio('top1', [ 'top1.ogg', 'top1.mp3' ]);
    this.load.audio('top2', [ 'top2.ogg', 'top2.mp3' ]);
}

function create ()
{
    this.add.image(790, 600, 'touhou').setOrigin(1);

    var bass = this.sound.add('bass');
    var drums = this.sound.add('drums');
    var percussion = this.sound.add('percussion');
    var synth1 = this.sound.add('synth1');
    var synth2 = this.sound.add('synth2');
    var top1 = this.sound.add('top1');
    var top2 = this.sound.add('top2');

    var keys = [
        'Press A for Bass',
        'Press B for Drums',
        'Press C for Percussion',
        'Press D for Synth1',
        'Press E for Synth2',
        'Press F for Top1',
        'Press G for Top2',
        '',
        'SPACE to stop all sounds'
    ];

    var text = this.add.text(10, 10, keys, { font: '32px Courier', fill: '#00ff00' });

    if (this.sound.locked)
    {
        text.setText('Click to start');

        this.sound.once('unlocked', function ()
        {
            text.setText(keys);
        });
    }

    this.input.keyboard.on('keydown-SPACE', function () {
        this.sound.stopAll();
    }, this);

    this.input.keyboard.on('keydown-A', function () {
        bass.play();
    });

    this.input.keyboard.on('keydown-B', function () {
        drums.play();
    });

    this.input.keyboard.on('keydown-C', function () {
        percussion.play();
    });

    this.input.keyboard.on('keydown-D', function () {
        synth1.play();
    });

    this.input.keyboard.on('keydown-E', function () {
        synth2.play();
    });

    this.input.keyboard.on('keydown-F', function () {
        top1.play();
    });

    this.input.keyboard.on('keydown-G', function () {
        top2.play();
    });
}
