var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    //  Here we'll create a simple key combo
    //  When you type in ABCD the event will be triggered on the entry of the final character (D)
    //  An incorrect key press will reset the combo back to the start again

    var combo = this.input.keyboard.createCombo('ABCD');

    this.input.keyboard.on('keycombomatch', function (event) {

        console.log('Key Combo matched!');

    });

}
