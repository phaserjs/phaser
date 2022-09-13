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

    var bunny = this.add.image(0, 0, 'bunny');

    bunny.alpha = 0.5;

    // bunny.color.alpha = 0.5;

}
