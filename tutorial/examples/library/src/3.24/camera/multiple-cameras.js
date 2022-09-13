var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);
var iter = 0;
var image;

function preload() {

    this.load.image('einstein', 'assets/pics/ra-einstein.png');

}

function create() {

    image = this.add.image(200, 150, 'einstein');

    this.cameras.main.setSize(400, 300);

    this.cameras.add(400, 0, 400, 300);
    this.cameras.add(0, 300, 400, 300);
    this.cameras.add(400, 300, 400, 300);
}

function update()
{
    image.rotation += 0.01;
}
