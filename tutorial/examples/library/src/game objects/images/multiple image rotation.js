var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var image1;
var image2;

function preload() {

    this.load.image('arrow', 'assets/sprites/arrow.png');

}

function create() {

    image1 = this.add.image(300, 300, 'arrow');
    image2 = this.add.image(400, 300, 'arrow');

    image1.name = 'bill';
    image2.name = 'ben';

}

function update() {

    image1.rotation += 0.01;
    image2.rotation -= 0.01;

}