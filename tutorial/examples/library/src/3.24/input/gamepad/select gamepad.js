var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    input: {
        gamepad: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var gamepad;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/skies/lightblue.png');
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    this.add.image(0, 0, 'sky').setOrigin(0);

    var text = this.add.text(10, 10, 'Press a button on the Gamepad to use', { font: '16px Courier', fill: '#00ff00' });

    this.input.gamepad.once('down', function (pad, button, index) {

        text.setText('Playing with ' + pad.id);

        gamepad = pad;

        sprite = this.add.image(400, 300, 'elephant');

    }, this);
}

function update ()
{
    if (gamepad)
    {
        if (gamepad.left)
        {
            sprite.x -= 4;
            sprite.flipX = false;
        }
        else if (gamepad.right)
        {
            sprite.x += 4;
            sprite.flipX = true;
        }

        if (gamepad.up)
        {
            sprite.y -= 4;
        }
        else if (gamepad.down)
        {
            sprite.y += 4;
        }
    }
}
