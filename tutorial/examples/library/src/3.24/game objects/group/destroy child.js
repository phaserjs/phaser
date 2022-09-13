var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var group;
var hsv;
var i = 0;
var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('invader', 'assets/tests/invaders/invader3.png', { frameWidth: 48, frameHeight: 32 });
}

function create ()
{
    hsv = Phaser.Display.Color.HSVColorWheel();

    //  Create some invaders
    group = this.add.group({ key: 'invader', frame: 0, repeat: 53 });

    //  And some debug text
    text = this.add.text(10, 10, 'Invaders: 54', { font: '16px Courier', fill: '#00ff00' });

    var invaders = group.getChildren();

    //  Align them in a grid
    Phaser.Actions.GridAlign(group.getChildren(), { width: 9, cellWidth: 58, cellHeight: 48, x: 132, y: 148 });

    //  On each click, kill a sprite
    this.input.on('pointerup', function (event) {

        //  Get a random sprite from the local array
        var invader = Phaser.Utils.Array.RemoveRandomElement(invaders);

        if (invader)
        {
            //  Then destroy it. This will fire a 'destroy' event that the Group will hear
            //  and then it'll automatically remove itself from the Group.
            invader.destroy();
        }

        console.log(group.getChildren());

    }, this);
}

function update ()
{
    text.setText('Invaders: ' + group.getLength());

    var tint = hsv[i];

    Phaser.Actions.SetTint(group.getChildren(), tint.color);

    i++;

    if (i === hsv.length)
    {
        i = 0;
    }
}
