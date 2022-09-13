var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    input: {
        queue: true
    },
    scene: {
        create: create,
        update: update
    }
};

var BKey;

var game = new Phaser.Game(config);

function create ()
{
    //  Global event listener, catches all keys

    //  Receives every single key down event, regardless of type

    this.input.keyboard.on('keydown', function (event) {

        console.dir(event);

    });

    //  Hook to a specific key without creating a new Key object (in this case the A key)

    this.input.keyboard.on('keydown-A', function (event) {

        console.log('Hello from the A Key!');

    });

    this.input.keyboard.on('keyup-RIGHT', function (event) {

        console.log('right up!');

    });

    //  Fire only once on a specific key up event (in this case the S key)

    this.input.keyboard.on('keyup-S', function (event) {

        console.log('Keyboard Events Stopped');

        this.input.keyboard.stopListeners();

    }, this);

    //  Create a Key object we can poll directly in a tight loop

    BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
}

function update ()
{
    if (BKey.isDown)
    {
        console.log('B!');
    }
}
