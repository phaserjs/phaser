var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var image1;
var image2;
var image3;

function preload() {

    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('tetris', 'assets/sprites/tetrisblock1.png');

}

function create() {

    image1 = this.add.image(500, 200, 'eye');
    image2 = this.add.image(180, 150, 'tetris');
    image3 = this.add.image(400, 300, 'bunny');

}
