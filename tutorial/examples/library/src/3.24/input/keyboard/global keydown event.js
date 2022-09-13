var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    //  Receives every single key down event, regardless of origin or key

    this.input.keyboard.on('keydown', function (event) {

        console.dir(event);

    });

}
