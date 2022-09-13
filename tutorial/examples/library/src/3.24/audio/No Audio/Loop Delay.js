/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 *
 * Cyberpunk Street Environment by Luis Zuno (https://www.patreon.com/posts/8303915) / CC-BY-3.0
 */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#838282',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true,
    audio: {
        noAudio: true
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('atari-classic', 'assets/fonts/bitmap/atari-classic.png', 'assets/fonts/bitmap/atari-classic.xml');

    this.load.image('streets', 'assets/sprites/cyberpunk-street.png');

    this.load.atlas('speakers', 'assets/sprites/speakers/speakers.png', 'assets/sprites/speakers/speakers.json');

    this.load.audio('bass', ['assets/audio/tech/bass.ogg', 'assets/audio/tech/bass.mp3']);
    this.load.audio('drums', ['assets/audio/tech/drums.ogg', 'assets/audio/tech/drums.mp3']);
    this.load.audio('percussion', ['assets/audio/tech/percussion.ogg', 'assets/audio/tech/percussion.mp3']);
    this.load.audio('synth1', ['assets/audio/tech/synth1.ogg', 'assets/audio/tech/synth1.mp3']);
    this.load.audio('synth2', ['assets/audio/tech/synth2.ogg', 'assets/audio/tech/synth2.mp3']);
    this.load.audio('top1', ['assets/audio/tech/top1.ogg', 'assets/audio/tech/top1.mp3']);
    this.load.audio('top2', ['assets/audio/tech/top2.ogg', 'assets/audio/tech/top2.mp3']);
}

var topLeftSpeaker;
var topRightSpeaker;
var middleSpeaker;
var bottomSpeaker;

var gui;

var bass;

function create ()
{
    var streets = this.add.image(0, 0, 'streets');
    streets.setScale(600/192);
    streets.setOrigin(0);

    topLeftSpeaker = this.add.image(445, 332, 'speakers', 'top-left');
    topLeftSpeaker.setOrigin(1, 0.46);
    topRightSpeaker = this.add.image(445, 332, 'speakers', 'top-right');
    topRightSpeaker.setOrigin(0, 0.975);
    middleSpeaker = this.add.image(443, 417, 'speakers', 'middle');
    middleSpeaker.setOrigin(0.5, 1);
    bottomSpeaker = this.add.image(443, 504, 'speakers', 'bottom');
    bottomSpeaker.setOrigin(0.5, 1);

    bass = this.sound.add('bass');
    var drums = this.sound.add('drums');
    var percussion = this.sound.add('percussion');
    var synth1 = this.sound.add('synth1');
    var synth2 = this.sound.add('synth2');
    var top1 = this.sound.add('top1');
    var top2 = this.sound.add('top2');

    gui = new dat.GUI();
    var sm = gui.addFolder('Sound Manager');
    sm.add(this.sound, 'rate', 0.5, 2).listen();
    sm.add(this.sound, 'detune', -1200, 1200).step(50).listen();

    var loopMarker = {
        name: 'loop',
        start: 0,
        duration: 7.68,
        config: {
            loop: true
        }
    };

    if(this.sound.locked)
    {
        var text = this.add.bitmapText(400, 70, 'atari-classic', 'Tap to start', 40);
        text.x -= Math.round(text.width/2);
        text.y -= Math.round(text.height/2);

        this.sound.once('unlocked', function (soundManager)
        {
            text.visible = false;

            startStem.call(this, bass, 'Bass', bottomSpeaker);

        }, this);
    }
    else
    {
        startStem.call(this, bass, 'Bass', bottomSpeaker);
    }

    bass.addMarker(loopMarker);

    // Delay option can only be passed in config
    bass.play('loop', {
        delay: 0
    });

    // Below won't work

    // sound.delay = delay;
    // sound.play('loop');

    bass.once('looped', function (sound) {
        startStem.call(this, drums, 'Drums', middleSpeaker);
    }, this);

    drums.addMarker(loopMarker);
    drums.play('loop', {
        delay: loopMarker.duration
    });
    drums.once('looped', function (sound) {
        startStem.call(this, percussion, 'Percussion', middleSpeaker);
    }, this);

    percussion.addMarker(loopMarker);
    percussion.play('loop', {
        delay: loopMarker.duration * 2
    });
    percussion.once('looped', function (sound) {
        startStem.call(this, synth1, 'Synth 1', topRightSpeaker);
    }, this);

    synth1.addMarker(loopMarker);
    synth1.play('loop', {
        delay: loopMarker.duration * 3
    });
    synth1.once('looped', function (sound) {
        startStem.call(this, synth2, 'Synth 2', topRightSpeaker);
    }, this);

    synth2.addMarker(loopMarker);
    synth2.play('loop', {
        delay: loopMarker.duration * 4
    });
    synth2.once('looped', function (sound) {
        startStem.call(this, top1, 'Top 1', topLeftSpeaker);
    }, this);

    top1.addMarker(loopMarker);
    top1.play('loop', {
        delay: loopMarker.duration * 5
    });
    top1.once('looped', function (sound) {
        startStem.call(this, top2, 'Top 2', topLeftSpeaker);
        sm.open();
    }, this);

    top2.addMarker(loopMarker);
    top2.play('loop', {
        delay: loopMarker.duration * 6
    });
}

function startStem(stem, text, speaker)
{
    var s = gui.addFolder(text);
    s.add(stem, 'seek', 0, stem.duration).step(0.01).listen();
    s.add(stem, 'mute').listen();
    s.open();

    this.tweens.add({ targets: speaker,
        scaleX: 1.3,
        scaleY: 1.1,

        duration: 241,

        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

function update ()
{
    middleSpeaker.y = bottomSpeaker.y - bottomSpeaker.height*bottomSpeaker.scaleY;
    topLeftSpeaker.y =
        topRightSpeaker.y =
            middleSpeaker.y - middleSpeaker.height*middleSpeaker.scaleY;

    this.tweens.setGlobalTimeScale(bass.totalRate);
}
