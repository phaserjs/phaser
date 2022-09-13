/**
 * @author    Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('atari-classic', 'assets/fonts/bitmap/atari-classic.png', 'assets/fonts/bitmap/atari-classic.xml');

    this.load.image('bg', 'assets/animations/nyan/bg.png');

    this.load.image('rainbow', 'assets/animations/nyan/rainbow.png');

    this.load.spritesheet('cat', 'assets/animations/nyan/cat.png', { frameWidth: 97, frameHeight: 59 });

    this.load.audio('CatAstroPhi', [
        'assets/audio/CatAstroPhi_shmup_normal.ogg',
        'assets/audio/CatAstroPhi_shmup_normal.mp3'
    ]);
}

var cat;
var catAstroPhi;
var rainbowMask;

function create () {

    catAstroPhi = this.sound.add('CatAstroPhi');

    catAstroPhi.play({
        seek: 2.550
    });

    // play() method call above has the same effect as the
    // two lines below but it is done in only one command
    // and it is a bit more efficient

    // catAstroPhi.play();
    // catAstroPhi.seek = 2.550;

    this.add.image(400, 300, 'bg');

    if(this.sound.locked)
    {
        var text = this.add.bitmapText(400, 300, 'atari-classic', 'Tap to start', 40);
        text.x -= Math.round(text.width/2);
        text.y -= Math.round(text.height/2);

        this.sound.once('unlocked', function (soundManager)
        {
            text.visible = false;

            setup.call(this);

        }, this);
    }
    else
    {
        setup.call(this);
    }
}

function setup ()
{
    var gui = new dat.GUI();

    var sm = gui.addFolder('CatAstroPhi Sound');
    sm.add(catAstroPhi, 'seek', 0, catAstroPhi.duration).step(0.01).listen();
    sm.add(catAstroPhi, 'rate', 0.5, 2).listen();
    sm.add(catAstroPhi, 'detune', -1200, 1200).step(50).listen();
    sm.add(catAstroPhi, 'loop').listen();
    sm.add(catAstroPhi, 'play');
    sm.add(catAstroPhi, 'pause');
    sm.add(catAstroPhi, 'resume');
    sm.add(catAstroPhi, 'stop');
    sm.open();

    rainbowMask = this.make.graphics();

    var rainbow = this.add.image(400, 300, 'rainbow');
    rainbow.mask = new Phaser.Display.Masks.GeometryMask(this, rainbowMask);

    this.anims.create({
        key: 'cat',
        frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 6, first: 0 }),
        frameRate: 15,
        repeat: -1
    });

    cat = this.add.sprite(0, 300, 'cat').setInteractive();
    cat.play('cat');

    this.input.setDraggable(cat);

    this.input.on('drag', function (pointer, cat, dragX, dragY) {

        cat.x = Math.min(Math.max(cat.width/2, dragX), 800 - cat.width/2);

        catAstroPhi.seek = (cat.x - cat.width/2)/(800 - cat.width) * catAstroPhi.duration;
    });
}

function update ()
{
    if(cat)
    {
        cat.x = cat.width/2 + (catAstroPhi.seek / catAstroPhi.duration) * (800 - cat.width);

        rainbowMask.clear();
        rainbowMask.fillRect(0, 0, cat.x - 15, 600);

        if(!catAstroPhi.isPlaying && cat.anims.isPlaying)
        {
            cat.anims.pause();
        }
        else if (catAstroPhi.isPlaying && !cat.anims.isPlaying)
        {
            cat.anims.resume();
        }

        cat.anims.setTimeScale(catAstroPhi.totalRate);
    }
}
