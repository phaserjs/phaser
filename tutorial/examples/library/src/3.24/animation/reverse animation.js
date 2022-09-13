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
        frameRate: 6,
        yoyo: false,
        repeat: -1
    };

    anim = this.anims.create(config);

    sprite = this.add.sprite(400, 250, 'mummy').setScale(4);

    //  Debug text
    progress = this.add.text(100, 420, 'Progress: 0%', { color: '#00ff00' });

    this.input.keyboard.on('keydown-SPACE', function (event) {
        sprite.play('walk');
    });

	this.input.keyboard.on('keydown-Y', function (event) {
        sprite.anims.yoyo = !sprite.anims.yoyo;
    });

	this.input.keyboard.on('keydown-Q', function (event) {
        sprite.playReverse('walk');
    });

	this.input.keyboard.on('keydown-R', function (event) {
		sprite.anims.reverse();
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
}

function updateFrameView ()
{
	if (sprite.anims.isPlaying)
    {
		frameView.clear();
		frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
	}
}

function update ()
{
    updateFrameView();

    var debug = [
        'SPACE to play the animation, Q to play reverse,',
		'R to revert at any time, P to pause/resume,',
		'Y to toggle yoyo',
		'',
		'Yoyo: ' + sprite.anims.yoyo,
		'Reverse: ' + sprite.anims.inReverse,
        'Progress: ' + sprite.anims.getProgress() * 100 + '%',
        'Accumulator: ' + sprite.anims.accumulator,
        'NextTick: ' + sprite.anims.nextTick
    ];

    progress.setText(debug);
}
