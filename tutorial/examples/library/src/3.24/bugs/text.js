var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var text = this.add.text(10, 300, 'Click on this long line of Text').setFontFamily('Arial').setFontSize(48).setColor('#ffff00');

    var i = 0;

    text.setInteractive();

    text.on('pointerdown', function () {

        if (i === 0)
        {
            text.setText('Hello there');
        }
        else
        {
            text.setText('And we are back ' + i);
        }

        i++;

    });
}
