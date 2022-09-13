var config = {
    type: Phaser.WEBGL,
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

var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/skies/lightblue.png');
}

function create ()
{
    this.add.image(0, 0, 'sky').setOrigin(0);

    text = this.add.text(10, 30, '', { font: '16px Courier', fill: '#ffffff' });
}

function update ()
{
    if (this.input.gamepad.total === 0)
    {
        return;
    }

    var debug = [];
    var pads = this.input.gamepad.gamepads;
    // var pads = this.input.gamepad.getAll();
    // var pads = navigator.getGamepads();

    for (var i = 0; i < pads.length; i++)
    {
        var pad = pads[i];

        if (!pad)
        {
            continue;
        }

        //  Timestamp, index. ID
        debug.push(pad.id);
        debug.push('Index: ' + pad.index + ' Timestamp: ' + pad.timestamp);

        //  Buttons

        var buttons = '';

        for (var b = 0; b < pad.buttons.length; b++)
        {
            var button = pad.buttons[b];

            buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
            // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');

            if (b === 8)
            {
                debug.push(buttons);
                buttons = '';
            }
        }
        
        debug.push(buttons);

        //  Axis

        var axes = '';

        for (var a = 0; a < pad.axes.length; a++)
        {
            var axis = pad.axes[a];

            axes = axes.concat('A' + axis.index + ': ' + axis.getValue() + '  ');
            // axes = axes.concat('A' + a + ': ' + axis + '  ');

            if (a === 1)
            {
                debug.push(axes);
                axes = '';
            }
        }
        
        debug.push(axes);
        debug.push('');
    }
    
    text.setText(debug);
}
