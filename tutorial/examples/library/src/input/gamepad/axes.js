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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/skies/lightblue.png');
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    this.add.image(0, 0, 'sky').setOrigin(0);

    sprite = this.add.sprite(400, 300, 'elephant');
}

function update ()
{
    if (this.input.gamepad.total === 0)
    {
        return;
    }

    var pad = this.input.gamepad.getPad(0);

    if (pad.axes.length)
    {
        var axisH = pad.axes[0].getValue();
        var axisV = pad.axes[1].getValue();

        sprite.x += 4 * axisH;
        sprite.y += 4 * axisV;

        sprite.flipX = (axisH > 0);
    }
}
