var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload () 
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create () 
{
    var text = "The sky above the port was the color of television, tuned to a dead channel. `It's not like I'm using,' Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. `It's like my body's developed this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.";

    var b = this.add.bitmapText(0, 0, 'desyrel', text, 32).setMaxWidth(700);

    var g = this.add.graphics();

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
