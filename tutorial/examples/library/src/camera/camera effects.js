class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
    }

    create ()
    {
        this.add.image(0, 0, 'CherilPerils');

        this.cameras.main.setViewport(5, 5, 390, 290);

        this.fadeCamera = this.cameras.add(405, 5, 390, 290);
        this.flashCamera = this.cameras.add(5, 305, 390, 290);
        this.shakeCamera = this.cameras.add(405, 305, 390, 290);

        this.fadeCamera.fade(2000);

        this.flashCamera.flash(1000);
    }

    update ()
    {
        // flashCamera.flash(750);
        this.shakeCamera.shake(1000, 0.025);

        if (this.fadeCamera.fadeEffect.alpha >= 1)
        {
            this.fadeCamera.fadeEffect.alpha = 0;
            this.fadeCamera.fade(2000);
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: [ Example ],
    width: 800,
    height: 600
};

const game = new Phaser.Game(config);
