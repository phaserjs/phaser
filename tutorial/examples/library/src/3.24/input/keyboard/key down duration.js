var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

var key;
var text;

var game = new Phaser.Game(config);

function create ()
{
    key = this.input.keyboard.addKey('A');

    this.add.text(10, 10, 'Hold down the A Key', { font: '16px Courier', fill: '#00ff00' });

    text = this.add.text(10, 30, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    text.setText('Duration: ' + key.getDuration() + 'ms');
}
