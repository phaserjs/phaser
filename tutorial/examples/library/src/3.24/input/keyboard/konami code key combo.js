var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    //  37 = LEFT
    //  38 = UP
    //  39 = RIGHT
    //  40 = DOWN

    var combo = this.input.keyboard.createCombo([ 38, 38, 38, 40, 40, 40, 37, 37, 37, 39, 39, 39 ], { resetOnMatch: true });

    this.input.keyboard.on('keycombomatch', function (event) {

        console.log('Konami Code entered!');

    });

}
