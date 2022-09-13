var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image1;
var image2;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');
}

function create ()
{
    image1 = this.add.image(400, 150, 'atlas', 'atari400');
    image2 = this.add.image(400, 400, 'atlas', 'hotdog');

    //  Set the tint like this (topLeft, topRight, bottomLeft, bottomRight)

    image1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

    image2.setTint(0x0000ff, 0xff0000, 0xff00ff, 0xffff00);
}

function update ()
{
    image1.rotation -= 0.02;
    image2.rotation += 0.02;
}