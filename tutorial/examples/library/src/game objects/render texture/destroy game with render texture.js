var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var rt;
var bubbles = [];

function preload ()
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create ()
{
    rt = this.add.renderTexture(0, 0, 80, 80);

    var circle = this.add.circle(0, 0, 40, 0x6666ff).setAlpha(0.5).setVisible(false);

    rt.draw(circle, 40, 40);
    rt.draw('dude', 24, 20);

    rt.saveTexture('bubbleboy');

    for (var i = 0; i < 50; i++)
    {
        var b = this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'bubbleboy');

        bubbles.push(b);
    }

    this.input.on('pointerup', function () {

        game.destroy(true);

    });
}
