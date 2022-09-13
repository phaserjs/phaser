var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bunny', 'assets/sprites/bunny.png');

}

function create() {

    var parent = this.add.image(0, 0, 'bunny');

    var child = this.add.image(100, 100, 'bunny');

    parent.alpha = 0.5;

}
