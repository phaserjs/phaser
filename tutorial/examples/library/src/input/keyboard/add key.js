var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            drawKeyboard: drawKeyboard
        }
    }
};

var game = new Phaser.Game(config);

var keyA;
var key5;
var keySpace;
var highlight1;

function preload ()
{
    this.load.image('keyboard', 'assets/input/keyboard-opreem.png');
    this.load.image('highlight', 'assets/input/key1.png');
}

function create ()
{
    this.drawKeyboard();

    //  Create a Key object we can poll directly.

    //  This is especially useful if you need to poll the key in a tight loop, such as for player controls.

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);

    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

}

function drawKeyboard ()
{
    this.add.image(0, 0, 'keyboard').setOrigin(0);

    highlight1 = this.add.image(108, 112, 'highlight').setOrigin(0);

    /*
    var row = [1,2,3,4,5,6,7,8,9,0,'Minus','Plus','Backspace_Alt'];

    x = 100;
    y = 100;
    spacing = 106;

    for (var i = 0; i < row.length; i++)
    {
        var key = row[i];

        this.add.image(x, y, 'keyboard', key);

        x += spacing;
    }
    */

}

function update() {

    if (keyA.isDown)
    {
        console.log('A');
    }

    if (key5.isDown)
    {
        console.log('5');
    }

    if (keySpace.isDown)
    {
        console.log('spacebar');
    }

}