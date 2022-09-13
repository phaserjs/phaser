class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/space4.png');
        this.load.image('planet', 'assets/sprites/planet3.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const planet = this.add.image(400, 300, 'planet');

        planet.setScale(0.2);

        const text = this.add.text(16, 16, 'Tween Callbacks\n').setFontSize(16).setColor('#ffffff');
        const text2 = this.add.text(500, 16, 'Tween onUpdate').setFontSize(16).setColor('#ffffff');

        const text2Debug = [ 'Tween onUpdate', '' ];

        const tween = this.tweens.add({
            targets: planet,
            scaleX: 1,
            scaleY: 1,
            ease: 'Power1',
            duration: 2000,
            paused: true,
            loop: 1,
            yoyo: 1,
            repeat: 1,
            onActive: (tween, targets, param) => {
                text.appendText(param);
            },
            onStart: (tween, target, param) => {
                text.appendText(param);
            },
            onLoop: (tween, target, param) => {
                text.appendText(param);
            },
            onComplete: (tween, target, param) => {
                text.appendText(param);
            },
            onStop: (tween, target, param) => {
                text.appendText(param);
            },
            onActiveParams: [ 'onActive - click to start' ],
            onStartParams: [ 'onStart' ],
            onLoopParams: [ 'onLoop' ],
            onCompleteParams: [ 'onComplete' ],
            onStopParams: [ 'onStop' ],
            onYoyo: (tween, target, key) => {
                text.appendText('onYoyo - ' + key);
            },
            onRepeat: (tween, target, key) => {
                text.appendText('onRepeat - ' + key);
            },
            onUpdate: (tween, target, key, current, previous) => {

                if (key === 'scaleX')
                {
                    text2Debug[2] = 'scaleX: ' + current
                }
                else if (key === 'scaleY')
                {
                    text2Debug[3] = 'scaleY: ' + current
                }

                text2.setText(text2Debug);
            }
        });

        this.input.on('pointerdown', () => {

            if (tween.isPlaying())
            {
                tween.stop();
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
