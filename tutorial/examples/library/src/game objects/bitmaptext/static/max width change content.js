let goodText, badText;
const message = "Look at this beautiful text!";

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.bitmapFont('desyrel-pink', 'assets/fonts/bitmap/desyrel-pink.png', 'assets/fonts/bitmap/desyrel-pink.xml');
    }

    create ()
    {
        goodText = this.add.bitmapText(50, 50, 'desyrel-pink', '', 24);
        badText = this.add.bitmapText(50, 100, 'desyrel-pink', '', 24);
        badText.setMaxWidth(500);
    }

    update ()
    {
        for (const t of [goodText, badText]) {
            if (t.text.length < message.length) {
            const nextChar = message[t.text.length];
            t.setText(t.text + nextChar);
            // uncomment the next line to workaround the bug
            // t._bounds.maxWidth--;
          }
        }
    }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  scene: [ Example ]
};

const game = new Phaser.Game(config);
