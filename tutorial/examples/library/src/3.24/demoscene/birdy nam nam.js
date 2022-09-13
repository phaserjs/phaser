var loaderSceneConfig = {
    key: 'loader',
    active: true,
    preload: bootLoader,
    create: bootCreate
};

var demoSceneConfig = {
    key: 'demo',
    active: false,
    visible: false,
    preload: preload,
    create: create,
    extend: {
        startDemo: startDemo
    }
};

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 640,
    height: 338,
    scene: [ loaderSceneConfig, demoSceneConfig ]
};

var track;
var bird;
var egg = 0;
var chick1;
var chick2;
var chick3;
var loadImage;

var game = new Phaser.Game(config);

function bootLoader ()
{
    this.load.image('loader', 'assets/demoscene/birdy-nam-nam-loader.png');
    this.load.image('click', 'assets/demoscene/birdy-nam-nam-click.png');
}

function bootCreate ()
{
    this.scene.start('demo');
}

function preload ()
{
    loadImage = this.add.image(0, 0, 'loader').setOrigin(0);

    this.load.audio('jungle', [ 'assets/audio/jungle.ogg', 'assets/audio/jungle.mp3' ]);
    this.load.animation('birdyAnims', 'assets/demoscene/birdy.json');
    this.load.image('bg1', 'assets/demoscene/birdy-nam-nam-bg1.png');
    this.load.image('bg2', 'assets/demoscene/birdy-nam-nam-bg2.png');
    this.load.atlas('birdy', 'assets/demoscene/budbrain.png', 'assets/demoscene/budbrain.json');
}

function create ()
{
    this.sound.pauseOnBlur = false;

    track = this.sound.add('jungle');

    this.anims.create({
        key: 'lay',
        frames: this.anims.generateFrameNames('birdy', { prefix: 'lay', start: 0, end: 19 }),
        frameRate: 28,
        delay: 1
    });

    if (this.sound.locked)
    {
        loadImage.setTexture('click');

        this.sound.once('unlocked', function ()
        {
            this.startDemo();
        }, this);
    }
    else
    {
        this.startDemo();
    }
}

function startDemo ()
{
    loadImage.setVisible(false);

    this.add.image(0, 0, 'bg1').setOrigin(0);

    bird = this.add.sprite(328, 152, 'birdy', 'lay0').setOrigin(0).setDepth(10);

    bird.on('animationcomplete', dropEgg, this);

    track.once('play', function ()
    {
        bird.anims.delayedPlay(2250, 'lay');
    });

    track.play();
}

function dropEgg ()
{
    var smallEgg = this.add.image(bird.x + 116, 228, 'birdy', 'egg-small').setOrigin(0);

    this.tweens.add({
        targets: smallEgg,
        y: 288,
        ease: 'Linear',
        delay: 800,
        duration: 200,
        completeDelay: 800,
        onComplete: moveBird,
        callbackScope: this
    });

    egg++;
}

function moveBird ()
{
    if (egg < 3)
    {
        bird.x -= 124;

        bird.play('lay');
    }
    else
    {
        //  Ready for scene 2
        this.time.addEvent({ delay: 800, callback: changeScene, callbackScope: this });
    }
}

function changeScene ()
{
    this.children.removeAll();

    this.add.image(0, 0, 'bg2').setOrigin(0);

    chick1 = this.add.sprite(100, 72, 'birdy', 'hatch1').setOrigin(0);
    chick2 = this.add.sprite(260, 72, 'birdy', 'hatch1').setOrigin(0);
    chick3 = this.add.sprite(420, 72, 'birdy', 'hatch1').setOrigin(0);

    chick1.anims.delayedPlay(1000-200, 'hatch');
    chick2.anims.delayedPlay(2000-200, 'hatch');
    chick3.anims.delayedPlay(3000-200, 'hatch');

    this.time.addEvent({ delay: 4500, callback: checkDisOut, callbackScope: this });
}

function checkDisOut ()
{
    chick1.anims.play('lookRight');
    chick2.anims.play('checkDisOut');
    chick3.anims.play('lookLeft');
}
