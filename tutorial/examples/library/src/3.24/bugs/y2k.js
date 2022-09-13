var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('a', 'assets/sprites/bullet.png');
    this.load.image('b', 'assets/sprites/enemy-bullet.png');
    this.load.image('c', 'assets/sprites/car-police.png');
    this.load.image('d', 'assets/sprites/car-red.png');
}

function create ()
{
    //  Bullet is 9x9, space out at 10x10
    //  Need 2000 images (or more)

    var i = 0;
    var maxX = 50;
    var maxY = 40;
    // var maxY = 30;

    //  2000 images:
    for (var y = 0; y < maxY; y++)
    {
        for (var x = 0; x < maxX; x++)
        {
            var f = (i % 2) ? 'a' : 'b';
            // var f = 'b';

            this.add.image(100 + (x * 10), 100 + (y * 10), f).setOrigin(0).setName('bob-' + x.toString() + '-' + y.toString());

            i++;
        }
    }

    //  2001
    // this.add.image(30, 30, 'b').setOrigin(0).setName('extra');
    this.add.image(30, 30, 'c').setOrigin(0);

    //  2002
    //  Whatever texture we have here, 2001 is given it
    // this.add.image(100, 30, 'b').setOrigin(0);
    this.add.image(100, 30, 'd').setOrigin(0);

    //  2003
    // this.add.image(170, 30, 'b').setOrigin(0);
    this.add.image(170, 30, 'c').setOrigin(0);

    // console.log(i);
}