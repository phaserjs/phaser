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
var lancelot;

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

    this.add.text(400, 8, 'Tweening the Animation.timeScale', { color: '#ffffff' }).setOrigin(0.5, 0);

    var runConfig = {
        key: 'run',
        frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
        frameRate: 12,
        repeat: -1
    };

    this.anims.create(runConfig);

    lancelot = this.add.sprite(480, 536, 'knight');

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(8);
    lancelot.play('run');

    this.tweens.add({
        targets: lancelot.anims,
        timeScale: { from: 0.5, to: 2 },
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1,
        repeatDelay: 1000,
        hold: 1000,
        duraton: 3000
    });
}

function update ()
{
    bg.tilePositionX += 3 * lancelot.anims.timeScale;
    ground.tilePositionX += 6 * lancelot.anims.timeScale;
}
