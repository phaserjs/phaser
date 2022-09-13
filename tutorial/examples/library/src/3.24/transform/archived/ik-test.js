var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 1024,
    height: 768
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('saw', 'assets/sprites/saw.png');

}

var images = [];
var factor = 0;

function addIKDemo(parent, scene)
{
    var lastImage = parent;
    images.push(lastImage);
    for (var i = 0; i < 10; ++i)
    {
        var newImage = scene.add.image(64, 0, 'saw');
        lastImage.transform.add(newImage.transform);
        lastImage = newImage;
        images.push(lastImage);
    }
}

function create() {
    for (var i = 0; i < 100; ++i)
    {
        var rootImage = this.add.image(Math.random() * 1024, Math.random() * 768, 'saw');
        addIKDemo(rootImage, this);
    }
}

function update()
{
    for (var i = 0, l = images.length; i < l; ++i)
    {
        images[i].transform.rotation += 0.01;
        images[i].transform.scaleX = Math.min(0.2 + Math.abs(Math.sin(factor * 0.1)), 1);
        images[i].transform.scaleY = images[i].transform.scaleX;
    }
    factor += 0.01;
}
