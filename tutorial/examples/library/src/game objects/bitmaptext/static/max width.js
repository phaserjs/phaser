class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    }

    create ()
    {
        const text = "The sky above the port was the color of television, tuned to a dead channel. `It's not like I'm using,' Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. `It's like my body's developed this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.";

        const b = this.add.bitmapText(0, 0, 'desyrel', text, 32).setMaxWidth(700);

        const g = this.add.graphics();

        this.tweens.add({
            targets: b,
            maxWidth: 400,
            ease: 'power1',
            duration: 5000,
            hold: 1000,
            yoyo: true,
            repeat: -1,
            repeatDelay: 1000,
            onUpdate: function ()
            {
                g.clear();
                g.fillStyle(0x00ff00, 1);
                g.fillRect(b.maxWidth, 0, 2, 600);
            }
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
