class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('sf2', 'assets/animations/sf2.png', 'assets/animations/sf2.json');
    }

    create ()
    {
        var animConfig = {
            key: 'ryu',
            frames: this.anims.generateFrameNames('sf2', { prefix: 'frame_', end: 22 }),
            frameRate: 20,
            repeat: 3
        };

        this.anims.create(animConfig);

        const sprite = this.add.sprite(550, 600, 'sf2', 'frame_0')
            .setOrigin(0.5, 1)
            .setScale(2);

        const text = this.add.text(32, 32, 'Click to Start Animation', { color: '#00ff00' });

        let log = [];
        let u = 0;
        let ui = 0;

        sprite.on(Phaser.Animations.Events.ANIMATION_START, function (anim, frame, gameObject) {

            log.push('ANIMATION_START');
            text.setText(log);

            u = 0;
            ui = 0;

        });

        sprite.on(Phaser.Animations.Events.ANIMATION_STOP, function (anim, frame, gameObject) {

            log.push('ANIMATION_STOP');
            text.setText(log);

            u = 0;
            ui = 0;

        });

        sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim, frame, gameObject) {

            if (u === 0)
            {
                log.push('ANIMATION_UPDATE x0');

                u++;
                ui = log.length - 1;
            }
            else
            {
                log[ui] = 'ANIMATION_UPDATE x' + u.toString();
                u++;
            }

            text.setText(log);

        });

        sprite.on(Phaser.Animations.Events.ANIMATION_REPEAT, function (anim, frame, gameObject) {

            u = 0;

            log.push('ANIMATION_REPEAT');

            text.setText(log);

        });

        sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim, frame, gameObject) {

            log.push('ANIMATION_COMPLETE');

            text.setText(log);

        });

        this.input.on('pointerdown', function () {

            if (sprite.anims.isPlaying)
            {
                sprite.stop();
            }
            else
            {
                log = [];

                sprite.play('ryu');
            }

        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
