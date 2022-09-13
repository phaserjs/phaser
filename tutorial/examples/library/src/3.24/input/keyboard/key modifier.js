var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.input.keyboard.on('keydown_A', function (event) {

        if (event.ctrlKey)
        {
            console.log('A + CTRL');
        }
        else if (event.altKey)
        {
            console.log('A + ALT');
        }
        else if (event.shiftKey)
        {
            console.log('A + Shift');
        }
        else
        {
            console.log('A without modifier');
        }

    });
}
