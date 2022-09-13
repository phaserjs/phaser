var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var t = 0;
var image0, image1;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('p0', 'assets/particles/red.png');
    this.load.image('p1', 'assets/particles/yellow.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    var bunny = this.add.image(400, 300, 'bunny');
    image0 = this.add.image(400-15, 300, 'p0');
    image1 = this.add.image(400+15, 300, 'p1');
    image0.blendMode = 'ADD';
    image1.blendMode = 'ADD';
}

function update ()
{
    image0.y = image1.y = 300 + Math.sin(t) * 100;
    t += 0.01;
}