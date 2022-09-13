var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload () {

    this.load.image('logo', 'assets/sprites/phaser.png');

}

function create() {

    this.input.on('pointerdown', function (pointer) {

        console.log('down');

        this.add.image(pointer.x, pointer.y, 'logo');

    }, this);

}
