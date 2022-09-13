class Example extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.atlas('knight', 'assets/animations/knight.png', 'assets/animations/knight.json');
        this.load.image('bg', 'assets/skies/clouds.png');
        this.load.spritesheet('tiles', 'assets/tilemaps/tiles/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        //  The background and floor
        this.bg = this.add.tileSprite(0, 16, 800, 600, 'bg').setOrigin(0);
        this.ground = this.add.tileSprite(0, 536, 800, 64, 'tiles', 1).setOrigin(0);

        this.add.text(400, 8, 'Tweening the Animation.timeScale', { color: '#ffffff' }).setOrigin(0.5, 0);

        const runConfig = {
            key: 'run',
            frames: this.anims.generateFrameNames('knight', { prefix: 'run/frame', start: 0, end: 7, zeroPad: 4 }),
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(runConfig);

        this.lancelot = this.add.sprite(480, 536, 'knight');

        this.lancelot.setOrigin(0.5, 1);
        this.lancelot.setScale(8);
        this.lancelot.play('run');

        this.tweens.add({
            targets: this.lancelot.anims,
            timeScale: { from: 0.5, to: 2 },
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1,
            repeatDelay: 1000,
            hold: 1000,
            duraton: 3000
        });
    }

    update() {
        this.bg.tilePositionX += 3 * this.lancelot.anims.timeScale;
        this.ground.tilePositionX += 6 * this.lancelot.anims.timeScale;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
