class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
    }

    create ()
    {
        let i = 0;
        const films = [ 'Aliens', 'Terminator', 'Star Wars', 'The Thing', 'Red Dawn', 'Commando', 'Terminator 2', 'Robocop', 'Batman', 'Street Fighter', 'Back to the Future' ];

        const text = this.add.bitmapText(400, 300, 'ice', films[i], 96).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            duration: 2000,
            angle: 360,
            ease: 'Quad.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.input.on('pointerdown', function () {

            i++;

            if (i === films.length)
            {
                i = 0;
            }

            text.setText(films[i]);

        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);

