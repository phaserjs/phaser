var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    //  Listen for a specific key (in this case the A key.)
    //  This works without creating a new Key object, and is especially useful for 'once' calls.
    //  For game input (i.e. player controls) you should use Key objects instead.

    this.input.keyboard.on('keydown_A', function (event) {

        console.log('Hello from the A Key!');

    });

    this.input.keyboard.on('keydown', function (event) {

        console.log(event.key);

    });

    this.input.keyboard.on('keydown_SPACE', function (event) {

        console.log('Hello from the Space Bar!');

    });

    this.input.keyboard.addCapture('SPACE');
}
