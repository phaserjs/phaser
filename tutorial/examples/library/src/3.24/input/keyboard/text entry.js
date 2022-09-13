var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.add.text(10, 10, 'Enter your name:', { font: '32px Courier', fill: '#ffffff' });

    var textEntry = this.add.text(10, 50, '', { font: '32px Courier', fill: '#ffff00' });

    this.input.keyboard.on('keydown', function (event) {

        if (event.keyCode === 8 && textEntry.text.length > 0)
        {
            textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
        }
        else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
        {
            textEntry.text += event.key;
        }

    });
}
