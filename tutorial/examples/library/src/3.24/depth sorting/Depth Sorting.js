var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var move = 0;
var mushroom0;
var mushroom1;
var mushroom2;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/tests/fruit/veg.png', 'assets/tests/fruit/veg.json');
    this.load.image('image', 'assets/sprites/mushroom2.png');
}

function create ()
{
    for (var i = 0; i < 2000; i++)
    {
        var image = this.add.image(100 + Math.random() * 600, 100 + Math.random() * 400, 'atlas', 'veg0' + Math.floor(1 + Math.random() * 9));
        image.depth = image.y;
    }

    mushroom0 = this.add.image(400, 300, 'image');
    mushroom1 = this.add.image(400, 300, 'image');
    mushroom2 = this.add.image(400, 300, 'image');
}

function update ()
{
    mushroom0.x = 400 + Math.cos(move) * 200;
    mushroom0.y = 300 + Math.sin(move) * 200;
    mushroom0.depth = mushroom0.y + mushroom0.height / 2;
    
    mushroom1.x = 400 + Math.sin(-move) * 200;
    mushroom1.y = 300 + Math.cos(-move) * 200;
    mushroom1.depth = mushroom1.y + mushroom1.height / 2;

    mushroom2.y = 300 + Math.sin(move) * 180;
    mushroom2.depth = mushroom2.y + mushroom2.height / 2;

    move += 0.01;
}