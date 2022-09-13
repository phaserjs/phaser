var config = {
    type: Phaser.CANVAS,
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

var image1;
var image2;

function create() {

    var image1 = this.add.image(0, 0, 'bunny');

    var image2 = this.add.image(200, 200, 'bunny');

    image1.transform.add(image2.transform);

    image1.rotation += 0.2;

}
