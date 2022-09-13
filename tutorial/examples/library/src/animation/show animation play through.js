class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    }

    create ()
    {
        //  Frame debug view
        this.frameView = this.add.graphics({ fillStyle: { color: 0xff00ff }, x: 32, y: 32 });

        //  Show the whole animation sheet
        this.add.image(32, 32, 'mummy', '__BASE').setOrigin(0);

        const config = {
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mummy'),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        };

        this.anim = this.anims.create(config);

        this.sprite = this.add.sprite(400, 300, 'mummy').setScale(4);

        this.sprite.anims.load('walk');

        //  Debug text
        this.progress = this.add.text(100, 500, 'Progress: 0%', { color: '#00ff00' });

        this.input.keyboard.on('keydown-SPACE', function (event) {

            this.sprite.anims.play('walk');

        }, this);

        this.input.keyboard.on('keydown-P', function (event) {

            if (this.sprite.anims.isPaused)
            {
                this.sprite.anims.resume();
            }
            else
            {
                this.sprite.anims.pause();
            }

        }, this);

        this.input.keyboard.on('keydown-R', function (event) {
            this.sprite.anims.restart();
        }, this);
    }

    update ()
    {
        this.updateFrameView();
        const debug = [
            'SPACE to start animation, P to pause/resume, R to restart',
            '',
            'Progress: ' + this.sprite.anims.getProgress() + '%',
            'Accumulator: ' + this.sprite.anims.accumulator,
            'NextTick: ' + this.sprite.anims.nextTick
        ];
        this.progress.setText(debug);
    }

    updateFrameView ()
    {
        this.frameView.clear();
        this.frameView.fillRect(this.sprite.frame.cutX, 0, 37, 45);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
