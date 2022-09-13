var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var anim;
var sprite;
var progress;
var frameView;

function preload ()
{
    this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
}

function create ()
{
    //  Frame debug view

    frameView = this.add.graphics({ fillStyle: { color: 0xff00ff }, x: 32, y: 32 });

    //  Show the whole animation sheet
    this.add.image(32, 32, 'mummy', '__BASE').setOrigin(0);

    var config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 8,
        yoyo: true,
        repeat: -1
    };

    anim = this.anims.create(config);

    sprite = this.add.sprite(400, 300, 'mummy').setScale(4);

    sprite.anims.load('walk');

    //  Debug text

    progress = this.add.text(100, 500, 'Progress: 0%', { color: '#00ff00' });

    this.input.keyboard.on('keydown-SPACE', function (event) {

        sprite.anims.play('walk');

    });

    this.input.keyboard.on('keydown-P', function (event) {

        if (sprite.anims.isPaused)
        {
            sprite.anims.resume();
        }
        else
        {
            sprite.anims.pause();
        }

    });

    this.input.keyboard.on('keydown-R', function (event) {

        sprite.anims.restart();

    });

}

function updateFrameView ()
{
    frameView.clear();
    frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
}

function update ()
{
    updateFrameView();

    var debug = [
        'SPACE to start animation, P to pause/resume, R to restart',
        '',
        'Progress: ' + sprite.anims.getProgress() + '%',
        'Accumulator: ' + sprite.anims.accumulator,
        'NextTick: ' + sprite.anims.nextTick
    ];

    progress.setText(debug);
}
