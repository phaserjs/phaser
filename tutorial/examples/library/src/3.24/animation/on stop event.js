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
var isRunning = true;

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

    this.add.text(400, 8, 'Click to stop animation', { color: '#ffffff' }).setOrigin(0.5, 0);

    //  Our run animation
    var animConfig = {
        key: 'run',
        frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
        frameRate: 12,
        repeat: -1
    };

    this.anims.create(animConfig);

    var lancelot = this.add.sprite(400, 536, 'knight');

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(8);
    lancelot.play('run');

    //  Event handler for when the animation completes on our sprite
    lancelot.on(Phaser.Animations.Events.ANIMATION_STOP, function () {

        isRunning = false;

    }, this);

    //  And a click handler to stop the animation
    this.input.once('pointerdown', function () {

        lancelot.stop();

    });
}

function update ()
{
    if (isRunning)
    {
        bg.tilePositionX += 2;
        ground.tilePositionX += 4;
    }
}
