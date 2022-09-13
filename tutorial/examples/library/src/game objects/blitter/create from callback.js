var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var x = 0;
var y = 0;
var i = 0;
var t = 16;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/demoscene/blue_ball.png');
}

function create ()
{
    var blitter = this.add.blitter(0, 0, 'ball');

    blitter.createFromCallback(placeBob.bind(this), t * 7);
}

function placeBob (bob)
{
    if (i % 16 === 0)
    {
        x += 96;
        y = 0;
    }

    y += 32;

    bob.x = x + (Math.sin(y) * 16);
    bob.y = y;

    i++;
}
