var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bg;
var ground;
var isRunning = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('knight', 'assets/animations/knight.png', 'assets/animations/knight.json');
    this.load.image('bg', 'assets/skies/clouds.png');
    this.load.spritesheet('tiles', 'assets/tilemaps/tiles/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
}

function create ()
{
    //  The background and floor
    bg = this.add.tileSprite(0, 16, 800, 600, 'bg').setOrigin(0);
    ground = this.add.tileSprite(0, 536, 800, 64, 'tiles', 1).setOrigin(0);

    this.add.text(400, 8, 'Click to start running animation', { color: '#ffffff' }).setOrigin(0.5, 0);

    //  Our animations

    var idleConfig = {
        key: 'idle',
        frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
        frameRate: 14,
        repeat: -1
    };

    this.anims.create(idleConfig);

    var runConfig = {
        key: 'run',
        frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
        frameRate: 12,
        repeat: -1
    };

    this.anims.create(runConfig);

    var lancelot = this.add.sprite(400, 536, 'knight');

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(8);
    lancelot.play('idle');

    //  Event handler for when the animation completes on our sprite
    lancelot.on(Phaser.Animations.Events.ANIMATION_START, function () {

        isRunning = true;

    }, this);

    //  And a click handler to stop the animation
    this.input.once('pointerdown', function () {

        lancelot.play('run');

    });
}

function update ()
{
    if (isRunning)
    {
        bg.tilePositionX += 4;
        ground.tilePositionX += 8;
    }
}
