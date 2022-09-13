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

var shakeTime = 0;
var objects = {};
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image', 'assets/sprites/mushroom2.png');
}

function create ()
{

    objects.camera = this.cameras.add(0, 0, 400, 300);
    objects.image0 = this.add.image(400, 300, 'image');
    objects.image1 = this.add.image(400, 300, 'image');
    objects.image2 = this.add.image(400, 300, 'image');
    objects.image3 = this.add.image(400, 300, 'image');
    objects.move = 0.0;
    objects.camera.zoom = 0.5;
    objects.camera.scrollX = 200;
    objects.camera.scrollY = 150;
    objects.camera.setBackgroundColor('rgba(255, 0, 0, 0.5)');
}

function update (time, delta)
{
    objects.image0.x = 400 + Math.cos(objects.move) * 300;
    objects.image0.y = 300 + Math.sin(objects.move * 2) * 200;
    objects.image1.x = 400 + Math.sin(objects.move * 2) * 300;
    objects.image1.y = 300 + Math.cos(objects.move) * 200;
    objects.image2.y = 300 + Math.cos(objects.move * 2) * 400;
    objects.image3.x = 400 + Math.sin(objects.move * 2) * 400;
    objects.move += 0.02;
}
