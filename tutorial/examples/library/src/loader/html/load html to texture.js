var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var image;

function preload ()
{
    this.load.htmlTexture('test1', 'assets/html/test1.html', 512, 512);
}

function create ()
{
    image = this.add.image(400, 300, 'test1').setOrigin(0);
}

function update ()
{
    image.rotation += 0.01;
}
