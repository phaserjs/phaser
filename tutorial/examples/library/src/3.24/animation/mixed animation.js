var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

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
    this.add.image(400, 48, 'bg').setOrigin(0.5, 0);

    for (var i = 0; i < 13; i++)
    {
        this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
    }

    var text = this.add.text(400, 8, 'Click to play\nIdle to Run mix: 1500ms\nRun to Idle mix: 500ms', { color: '#ffffff', align: 'center' }).setOrigin(0.5, 0);

    //  Our animations

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
        frameRate: 12,
        repeat: -1
    });

    //  Set a mix between 'idle' and 'run'.

    //  When transitioning from idle to run it will wait 1500ms before starting the run animation
    this.anims.addMix('idle', 'run', 1500);

    //  When transitioning from run to idle it will wait 500ms before starting the idle animation
    this.anims.addMix('run', 'idle', 500);

    var lancelot = this.add.sprite(500, 536)

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(8);
    lancelot.play('idle');

    this.input.on('pointerdown', function () {

        if (lancelot.anims.getName() === 'idle')
        {
            lancelot.play('run');
        }
        else if (lancelot.anims.getName() === 'run')
        {
            lancelot.play('idle');
        }

    });
}
