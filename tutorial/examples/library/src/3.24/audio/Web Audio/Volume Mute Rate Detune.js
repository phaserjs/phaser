/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 *
 * Images by Walter Newton (http://walternewton.tumblr.com/post/58684376490/like-a-train-in-the-night)
 * Music by Classical 8 Bit (http://classical8bit.tumblr.com/) / CC BY
 */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true
};

var horseFrames = [];
for(var i=0; i<12; i++)
{
    horseFrames.push({
        key: 'horse'+ ('0'+i).slice(-2),
        frame: '__BASE'
    });
}

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('atari-classic', 'assets/fonts/bitmap/atari-classic.png', 'assets/fonts/bitmap/atari-classic.xml');

    // Loading horse animation
    for(var i=0; i<horseFrames.length; i++)
    {
        this.load.image(horseFrames[i].key, 'assets/animations/horse/frame_' + ('0'+i).slice(-2) + '_delay-0.05s.png');
    }

    // Loading music
    this.load.audio('left', [
        'assets/audio/Rossini - William Tell Overture (8 Bits Version)/left.ogg',
        'assets/audio/Rossini - William Tell Overture (8 Bits Version)/left.mp3'
    ]);
    this.load.audio('right', [
        'assets/audio/Rossini - William Tell Overture (8 Bits Version)/right.ogg',
        'assets/audio/Rossini - William Tell Overture (8 Bits Version)/right.mp3'
    ]);
}

var horseLeft;
var horseRight;
var soundLeft;
var soundRight;

function create ()
{
    this.anims.create({
        key: 'horse',
        frames: horseFrames,
        frameRate: 20,
        repeat: -1
    });

    horseLeft = this.add.sprite(200, 300, 'horse09');
    horseLeft.setScale(400/480);

    horseRight = this.add.sprite(600, 300, 'horse10');
    horseRight.setScale(400/480);

    soundLeft = this.sound.add('left');
    soundLeft.play({
        loop: true
    });

    soundRight = this.sound.add('right');
    soundRight.play({
        loop: true
    });

    if(this.sound.locked)
    {
        var text = this.add.bitmapText(400, 50, 'atari-classic', 'Tap to start', 40);
        text.x -= Math.round(text.width/2);
        text.y -= Math.round(text.height/2);

        this.sound.once('unlocked', function (soundManager)
        {
            text.visible = false;

            start.call(this);

        }, this);
    }
    else
    {
        start.call(this);
    }
}

function start ()
{
    horseLeft.play('horse');
    horseRight.play('horse');

    var gui = new dat.GUI();

    var sm = gui.addFolder('Sound Manager');
    sm.add(this.sound, 'mute').listen();
    sm.add(this.sound, 'volume', 0, 1).listen();
    sm.add(this.sound, 'rate', 0.5, 2).listen();
    sm.add(this.sound, 'detune', -1200, 1200).step(50).listen();
    sm.open();

    var sl = gui.addFolder('Left');
    sl.add(soundLeft, 'mute').listen();
    sl.add(soundLeft, 'volume', 0, 1).listen();
    sl.add(soundLeft, 'rate', 0.5, 2).listen();
    sl.add(soundLeft, 'detune', -1200, 1200).step(50).listen();
    sl.open();

    var sr = gui.addFolder('Right');
    sr.add(soundRight, 'mute').listen();
    sr.add(soundRight, 'volume', 0, 1).listen();
    sr.add(soundRight, 'rate', 0.5, 2).listen();
    sr.add(soundRight, 'detune', -1200, 1200).step(50).listen();
    sr.open();
}

function update ()
{
    horseLeft.anims.setTimeScale(soundLeft.totalRate);
    horseRight.anims.setTimeScale(soundRight.totalRate);

    horseLeft.setAlpha(this.sound.volume * soundLeft.volume);
    horseRight.setAlpha(this.sound.volume * soundRight.volume);

    horseLeft.visible = !this.sound.mute && !soundLeft.mute;
    horseRight.visible = !this.sound.mute && !soundRight.mute;
}
