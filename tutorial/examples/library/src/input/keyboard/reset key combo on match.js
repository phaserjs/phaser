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
    //  When you type in ABC the event will be triggered on the entry of the final character (C)
    //  An incorrect key press will reset the combo back to the start again
    //  The extra config option allows you to trigger this combo as many times as you like, by typing ABC ABC ABC repeatedly

    var combo = this.input.keyboard.createCombo('ABC', { resetOnMatch: true });

    this.input.keyboard.on('keycombomatch', function (event) {

        console.log('Key Combo matched!');

    });

}
