class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/space4.png');
        this.load.image('planet', 'assets/sprites/planet2.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const planet = this.add.image(400, 300, 'planet');

        planet.setScale(0.2);

        const text = this.add.text(16, 16, 'Tween Events\n').setFontSize(16).setColor('#ffffff');
        const text2 = this.add.text(500, 16, 'TWEEN_UPDATE\n').setFontSize(16).setColor('#ffffff');

        const text2Debug = [ 'TWEEN_UPDATE', '' ];

        const tween = this.tweens.create({
            targets: planet,
            scale: 1,
            ease: 'Power1',
            duration: 2000,
            paused: true,
            loop: 1,
            yoyo: 1,
            repeat: 1
        });

        tween.on('active', () => {
            text.appendText('TWEEN_ACTIVE - click to start');
        });

        tween.on('start', () => {
            text.appendText('TWEEN_START');
        });

        tween.on('loop', () => {
            text.appendText('TWEEN_LOOP');
        });

        tween.on('stop', () => {
            text.appendText('TWEEN_STOP');
        });

        tween.on('complete', () => {
            text.appendText('TWEEN_COMPLETE');
        });

        tween.on('pause', () => {
            text.appendText('TWEEN_PAUSE');
        });

        tween.on('resume', () => {
            text.appendText('TWEEN_RESUME');
        });

        tween.on('yoyo', (tween, key) => {
            text.appendText('TWEEN_YOYO - ' + key);
        });

        tween.on('repeat', (tween, key) => {
            text.appendText('TWEEN_REPEAT - ' + key);
        });

        tween.on('update', (tween, key, target, current, previous) => {
            if (key === 'scaleX')
            {
                text2Debug[2] = 'scaleX: ' + current
            }
            else if (key === 'scaleY')
            {
                text2Debug[3] = 'scaleY: ' + current
            }

            text2.setText(text2Debug);
        });

        this.tweens.existing(tween);

        this.input.on('pointerdown', () => {

            if (tween.isPlaying())
            {
                tween.pause();
            }
            else if (tween.isPaused())
            {
                tween.resume();
            }
            else
            {
                tween.play();
            }

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
