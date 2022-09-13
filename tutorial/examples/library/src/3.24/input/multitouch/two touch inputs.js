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

var graphics;
var text;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    //  We need 3 extra pointers, as we only get 1 by default
    this.input.addPointer(3);

    text = this.add.text(10, 10, 'Use up to 4 fingers at once', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (this.input.pointer1.isDown || this.input.pointer2.isDown || this.input.pointer3.isDown || this.input.pointer4.isDown)
    {
        graphics.clear();
    }

    text.setText([
        'pointer1.isDown: ' + this.input.pointer1.isDown,
        'pointer2.isDown: ' + this.input.pointer2.isDown,
        'pointer3.isDown: ' + this.input.pointer3.isDown,
        'pointer4.isDown: ' + this.input.pointer4.isDown
    ]);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(this.input.pointer1.x, this.input.pointer1.y, 64, 64);

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(this.input.pointer2.x, this.input.pointer2.y, 64, 64);

    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(this.input.pointer3.x, this.input.pointer3.y, 64, 64);

    graphics.fillStyle(0xff00ff, 1);
    graphics.fillRect(this.input.pointer4.x, this.input.pointer4.y, 64, 64);
}
