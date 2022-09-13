var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var bunny;
var atari;

function preload() {

    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('atari', 'assets/sprites/atari130xe.png');

}

function create() {

    bunny = this.add.image(0, 0, 'bunny');
    atari = this.add.image(100, 100, 'atari');

}

function update() {

    bunny.x++;

    atari.x += 2;

}
